import mongoose from "mongoose";
import appointmentScheduleService from "../services/appointmentScheduleService";
import DoctorService from "../services/doctorService";
import PatientService from "../services/patientService";
import { TableResponseNoData, schemaFields } from "../utils/constant";
import { ApiStatus, ApiStatusCode, TableType, StatusAppointment } from "../utils/enum";
import validateReqBody, { ReqBody } from "../utils/requestbody";
import HistoriesService from "../services/historiesService";
import Validate from "../utils/validate";
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
      const { _id: scheduleId , statusAppointment: status, patientId } = await appointmentScheduleService.findOneWithId(req.body.id);
      if(status !== StatusAppointment.wait) {
        const err: any = new Error("Schedule not exist");
        err.statusCode = ApiStatusCode.BadRequest;
        await session.abortTransaction();
        session.endSession();
        return next(err)
      } else {
        const { hospitalization } = await PatientService.findOneById(patientId);
        await HistoriesService.createNew(scheduleId, hospitalization, session)
        const response = await appointmentScheduleService.changeStatusToProcess(req.body.id, doctorId, session);
        await session.commitTransaction();
        session.endSession();
        res.status(ApiStatusCode.OK).json({
          status: ApiStatus.succes,
          data: response
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
    
  }
  //PUT
  public static changeToDone = async (req, res, next) => {
    
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
    try {
      validateReqBody(req, [schemaFields.id, schemaFields.approve], next);
      const schedule = await appointmentScheduleService.approveScheduleRequest(req.body.id, req.body.approve);
      if(schedule) {
        res.status(ApiStatusCode.OK).json({
          status: ApiStatus.succes,
          message: "Chấp nhận lịch hẹn khám bệnh thành công"
        })
      } else {
        const err: any = new Error("Có lỗi xảy ra");
        err.statusCode = ApiStatusCode.BadRequest;
        return next(err)
      }
    } catch (error) {
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
}