import mongoose from "mongoose";
import appointmentScheduleService from "../services/appointmentScheduleService";
import DoctorService from "../services/doctorService";
import PatientService from "../services/patientService";
import { TableResponseNoData, schemaFields } from "../utils/constant";
import { ApiStatus, ApiStatusCode, TableType, StatusAppointment } from "../utils/enum";
import validateReqBody, { ReqBody } from "../utils/requestbody";
import Validate from "../utils/validate";
import historiesService from "../services/historiesService";
import testService from "../services/testService";
import HealthService from "../services/healthService";
import { IUpdateHealth } from "../models/Health";
import { ICreateBoarding, IEditBoarding } from "../models/Patient";
import boardingService from "../services/boardingService";
import prescriptionService from "../services/prescriptionService";
// import MomentTimezone from "../helpers/timezone";

export default class ScheduleController {
  //POST
  public static scheduleWait = async (req, res, next) => {
    try {
      validateReqBody(req, ReqBody.getTableValues, next);
      let data;
      const { userId } = req.user;
      switch(req.body.tableType) {
        case TableType.scheduleNormal:
          data = await appointmentScheduleService.getSchedulesNormal(req.body.page, req.body.pageSize, req.body.searchKey, userId);
          break;
        case TableType.scheduleParaclinical:
          data = await appointmentScheduleService.getSchedulesParaclinical(req.body.page, req.body.pageSize, req.body.searchKey, userId);
          break;
        case TableType.scheduleDoneParaclinical:
          data = await appointmentScheduleService.getSchedulesDoneParaclinical(req.body.page, req.body.pageSize, req.body.searchKey, userId);
          break;
        default:
          data = TableResponseNoData;
      }
      res.status(ApiStatusCode.OK).json({
        status: ApiStatus.succes,
        data: data
      })
    } catch (error) {
      next(error)
    }
  }

  //POST
  public static patientRequestMedical = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const { userId } = req.user;
      validateReqBody(req, ReqBody.patientRequestMedical, next);
      Validate.validateDob(req.body.appointmentDate, next);
      const { _id: patientId } = await PatientService.findByUserId(userId);
      if(patientId) {
        const appointmentDate = new Date(req.body.appointmentDate)
        const response = await appointmentScheduleService.createWithRequestMedical
          ( 
            patientId, 
            req.body.doctorId, 
            req.body.departmentId, 
            appointmentDate,
            req.body.initialSymptom,
            session
          ) as any;
          if(response._id) {
            await session.commitTransaction();
            session.endSession();
            res.status(ApiStatusCode.OK).json({
              status: ApiStatus.succes,
              messager: "Đặt lịch thành công, hãy chờ bác sĩ xác nhận"
            })
          } else {
            const err: any = new Error("Hẹn lịch không thành công, vui lòng liên hệ bộ phận hỗ trợ");
            err.statusCode = ApiStatusCode.BadRequest;
            await session.abortTransaction();
            session.endSession();
            return next(err)
          }
      } else {
        const err: any = new Error("Patient not exist");
        err.statusCode = ApiStatusCode.BadRequest;
        await session.abortTransaction();
        session.endSession();
        return next(err)
      }
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error)
    }
  }

  //POST
  public static getAllScheduleRequest = async (req, res, next) => {
    try {
      const { userId } = req.user;
      validateReqBody(req, ReqBody.getTableValues, next);
      const doctor = await DoctorService.getInforByUserId(userId);
      if(!doctor) {
        const err: any = new Error("Không tồn tại bác sĩ");
        err.statusCode = ApiStatusCode.BadRequest;
        return next(err)
      }
      let data;
      switch(req.body.tableType) {
        case TableType.scheduleRequestWaitApprove:
          data = await appointmentScheduleService.getAllScheduleRequest(req.body.page, req.body.pageSize, req.body.searchKey, doctor._id, false);
          break;
        case TableType.scheduleRequestApproved:
          data = await appointmentScheduleService.getAllScheduleRequest(req.body.page, req.body.pageSize, req.body.searchKey, doctor._id, true);
          break;
        default:
          data = TableResponseNoData;
      }
      res.status(ApiStatusCode.OK).json({
        status: ApiStatus.succes,
        data: data
      })

    } catch (error) {
      next(error)
    }
  }

  //PUT 
  public static responseScheduleRequest = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      // if approve, create History
      validateReqBody(req, [schemaFields.id, schemaFields.patientId, schemaFields.approve], next);
      if(req.body.approve) {
        const patient = await PatientService.findOneById(req.body.patientId);
        await historiesService.createNew(req.body.id, patient.hospitalization, session);
      }
      const schedule = await appointmentScheduleService.approveScheduleRequest(req.body.id, req.body.approve, session);
      if(schedule) {
        await session.commitTransaction();
        session.endSession();
        res.status(ApiStatusCode.OK).json({
          status: ApiStatus.succes,
          message: "Successful"
        })
      } else {
        await session.abortTransaction();
        session.endSession();
        const err: any = new Error("Có lỗi xảy ra");
        err.statusCode = ApiStatusCode.BadRequest;
        return next(err)
      }
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error)
    }
  }

  //POST
  public static getListRequestMedical = async (req, res, next) => {
    try {
      const { userId } = req.user;
      validateReqBody(req, ReqBody.getTableValues, next);
      const patient = await PatientService.findByUserId(userId);
      if(!patient) {
        const err: any = new Error("Không tòn tại bệnh nhân");
        err.statusCode = ApiStatusCode.BadRequest;
        return next(err)
      }
      let data;
      switch(req.body.tableType) {
        case TableType.scheduleRequestOfPatient:
          data = await appointmentScheduleService.patientGetListRequestMedical(req.body.page, req.body.pageSize, req.body.searchKey, patient._id);
          break;
        default:
          data = TableResponseNoData;
      }
      res.status(ApiStatusCode.OK).json({
        status: ApiStatus.succes,
        data: data
      })
    } catch (error) {
      next(error)
    }
  }

  public static getAllApproveRequestScheduleOfDoctor = async (req, res, next) => {
    try {
      const { userId } = req.user;
      validateReqBody(req, ReqBody.getTableValues, next);
      const doctor = await DoctorService.getInforByUserId(userId);
      if(!doctor) {
        const err: any = new Error("Không tòn tại bác sĩ");
        err.statusCode = ApiStatusCode.BadRequest;
        return next(err)
      }
      let data;
      switch(req.body.tableType) {
        case TableType.approveRequestMedical:
          data = await appointmentScheduleService.doctorGetAllRequestMedical(req.body.page, req.body.pageSize, req.body.searchKey, doctor._id);
          break;
        default:
          data = TableResponseNoData;
      }
      res.status(ApiStatusCode.OK).json({
        status: ApiStatus.succes,
        data: data
      })
    } catch (error) {
      next(error)
    }
  }

  //PUT
  public static changeStatusToProcess = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const { userId } = req.user;
      validateReqBody(req, ReqBody.changeStatusToProcess, next);
      const { _id: doctorId } = await DoctorService.getInforByUserId(userId);
      const { statusAppointment } = await appointmentScheduleService.findOneWithId(req.body.id);
      if(statusAppointment !== StatusAppointment.wait) {
        const err: any = new Error("Schedule not exist");
        err.statusCode = ApiStatusCode.BadRequest;
        await session.abortTransaction();
        session.endSession();
        return next(err)
      } else {
        await appointmentScheduleService.changeStatusToProcess(req.body.id, doctorId, session);
        // get
        const _history = await historiesService.findOneByKey(schemaFields.appointmentScheduleId, req.body.id);
        const testResult = await testService.getAllTestServiceInHistory(_history._id);
        await session.commitTransaction();
        session.endSession();
        res.status(ApiStatusCode.OK).json({
          status: ApiStatus.succes,
          data: { history: _history, testResult}
        })
      }
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error)
    }
  }

  //PUT
  public static changeToTesting = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      validateReqBody(req, ReqBody.changeToTesting, next);
      // change status to testing
      const appointmentUpdate = {
        initialSymptom: req.body.initialSymptom,
      };
      await appointmentScheduleService.changeStatusToTesting(req.body.appointmentScheduleId, appointmentUpdate, session);
      // update history
      const health = {
        heartRate: req.body.heartRate,
        temperature: req.body.temperature,
        bloodPressureSystolic: req.body.bloodPressureSystolic,
        bloodPressureDiastolic: req.body.bloodPressureDiastolic,
        glucose: req.body.glucose,
        weight: req.body.weight,
        height: req.body.height
      }
      const updateHistory = {
        healthIndicator: health,
      }
      await historiesService.updateHistory(req.body.historyId, updateHistory, session);
      // create test service
      const listService: string[] = req.body.testservices;
      const createTestPromises = listService.map((serviceId) => {
        const newTest = {
          historyId: req.body.historyId,
          serviceId: serviceId
        } 
        return testService.createTestResult(newTest, session);
      })
      await Promise.all(createTestPromises);
      await session.commitTransaction();
      session.endSession();
      res.status(ApiStatusCode.OK).json({
        status: ApiStatus.succes,
        message: "successful"
      })
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error)
    } 
  }
  //POST
  public static getAllTestRequestBeforeTesting = async (req, res, next) => {
    try {
      validateReqBody(req, [schemaFields.appointmentScheduleId], next);
      const { _id } = await historiesService.findOneByKey(schemaFields.appointmentScheduleId, req.body.appointmentScheduleId)
      const testResult = await testService.getAllTestServiceInHistory(_id);
      res.status(ApiStatusCode.OK).json({
        status: ApiStatus.succes,
        data: testResult
      })
    } catch (error) {
      next(error)
    }
  }
  //PUT
  public static testingToProcess = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      validateReqBody(req, ReqBody.changeStatusToProcess, next);
      const { statusAppointment } = await appointmentScheduleService.findOneWithId(req.body.id);
      if(statusAppointment !== StatusAppointment.testing) {
        const err: any = new Error("Schedule not exist");
        err.statusCode = ApiStatusCode.BadRequest;
        await session.abortTransaction();
        session.endSession();
        return next(err)
      } else {
        await appointmentScheduleService.changeStatusTestingToProcess(req.body.id, session);
        await session.commitTransaction();
        session.endSession();
        res.status(ApiStatusCode.OK).json({
          status: ApiStatus.succes,
          message: "successful"
        })
      }
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error)
    }
  }
  //PUT
  public static testingToWait = async (req, res, next) => {
    // change status to wait 
    // update test result
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const { userId } = req.user;
      validateReqBody(req, ReqBody.testingToProcess, next);
      const { _id: doctorId } = await DoctorService.getInforByUserId(userId);
      const listResult: any[] = req.body.testResults;
      if(listResult.length > 0) {
        await appointmentScheduleService.changeStatusToWaitAfterTesting(req.body.appointmentScheduleId, session);
        const listresults = listResult.map((result) => {
          let updateObj = {
            doctorId,
            detailsFileCloud: result.detailsFileCloud,
            reason: result.reason,
          }
          return testService.updateTestResultById(result.id, updateObj, session);
        })
        await Promise.all(listresults);
        await session.commitTransaction();
        session.endSession();
        res.status(ApiStatusCode.OK).json({
          status: ApiStatus.succes,
          message: "Successful"
        })
      } else {
        const err: any = new Error("Test Result không được trống");
        err.statusCode = ApiStatusCode.BadRequest;
        await session.abortTransaction();
        session.endSession();
        return next(err)
      }
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error)
    }
  }
  //PUT
  public static changeToDone = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      validateReqBody(req, ReqBody.changeToDone, next);
      // update AppointmentSchedule
      await appointmentScheduleService.changeStatusToDone(req.body.id, session);
      // update Health
      const updateHealth: IUpdateHealth = {
        heartRate: req.body.heartRate,
        temperature: req.body.temperature,
        bloodPressureSystolic: req.body.bloodPressureSystolic,
        bloodPressureDiastolic: req.body.bloodPressureDiastolic,
        glucose: req.body.glucose,
        weight: req.body.weight,
        height: req.body.height
      }
      await HealthService.updateHeathByPatientId(req.body.patientId, updateHealth, session);
      // update Histories
      const temphistory = {
        diagnosis: (req.body.diagnosis).toString(),
        summary: req.body.summary,
        healthIndicator: updateHealth
      }
      await historiesService.updateHistory(req.body.historyId, temphistory, session);
      // create Boarding
      // nếu bệnh nhân đã có bản ghi boarding, cập nhật, không thì tạo
      const existBoarding = await boardingService.findOneByKey(schemaFields.patientId, req.body.patientId);
      if(existBoarding) {
        const updateboarding: IEditBoarding = {
          departmentId: req.body.departmentId,
          boardingStatus: req.body.boardingStatus,
          onboardingDate: new Date
        }
        await boardingService.updateByPatientId(req.body.patientId, updateboarding, session);
      } else {
        const boarding: ICreateBoarding = {
          patientId: req.body.patientId,
          departmentId: req.body.departmentId,
          boardingStatus: req.body.boardingStatus,
          onboardingDate: new Date
        }
        await boardingService.create(boarding, session);
      }
      // create Prescription
      const prescription = {
        historyId: req.body.historyId,
        note: req.body.note,
        medicationId: (req.body.medicationId).toString(),
      }
      await prescriptionService.create(prescription, session);
      await session.commitTransaction();
      session.endSession();
      res.status(ApiStatusCode.OK).json({
        status: ApiStatus.succes,
        message: "Hoàn thành khám bệnh"
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error)
    }
  }

  //POST
  public static doctorRequestScheduleForPatientIn = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const { userId } = req.user;
      validateReqBody(req, ReqBody.doctorRequestSchedule, next);
      const { _id: doctorId } = await DoctorService.getInforByUserId(userId);
      if(doctorId) {
        await appointmentScheduleService.createWhenRegisterPatientIn(req.body.patientId, doctorId, req.body.initialSymptom, req.body.departmentId, new Date(req.body.appointmentDate), session);
      } else {
        const err: any = new Error("Hẹn lịch không thành công, vui lòng liên hệ bộ phận hỗ trợ");
        err.statusCode = ApiStatusCode.BadRequest;
        await session.abortTransaction();
        session.endSession();
        return next(err)
      }
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error)
    }
  }
}