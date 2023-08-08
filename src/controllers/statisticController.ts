import appointmentScheduleService from "../services/appointmentScheduleService";
import boardingService from "../services/boardingService";
import DepartmentService from "../services/departmentService"
import DoctorService from "../services/doctorService";
import PatientService from "../services/patientService";
import { ApiStatus, ApiStatusCode, Onboarding, Role, exportCsvType } from "../utils/enum";
import { Parser } from "json2csv";
import fs from "fs";
import MomentTimezone from "../helpers/timezone";
import historiesService from "../services/historiesService";


export default class StatisticController {

  //GET
  public static getDoctorWithDepartment = async (req, res, next) => {
    try {
      const departments = await DepartmentService.getAllOption();
      const _result = departments.reduce(async (acc, cur) => {
          (await acc).push(
            {
              departmentName: cur.departmentName,
              total: await DoctorService.getTotalDoctorsInDepartment(cur._id)
            }
          )
          return acc;
      }, Promise.resolve([]));
      const result = await _result;
      res.status(ApiStatusCode.OK).json({
        status: ApiStatus.succes,
        data: result
      })
    } catch (error) {
      next(error)
    }
  }

  //GET
  // số lượng bệnh nhân điều trị nội trú theo khoa
  public static getPatientsOnboardingWithDepartment = async (req, res, next) => {
    try {
      const departments = await DepartmentService.getAllOption();
      const _result = departments.reduce(async (acc, cur) => {
        (await acc).push(
          {
            departmentName: cur.departmentName,
            total: await boardingService.getTotalInPatientWithDepartment(cur._id)
          }
        )
        return acc;
      }, Promise.resolve([]));
      const result = await _result;
      res.status(ApiStatusCode.OK).json({
        status: ApiStatus.succes,
        data: result
      })
    } catch (error) {
      next(error)
    }
  }

  //GET
  // số lượng khám bệnh trong 7 ngày qua
  public static getTotalHistoryInLast7Day = async (req, res, next) => {
    try {
      let result;
      const { userId, role } = req.user;
      switch (role) {
        case Role.admin:
          result = await appointmentScheduleService.getCountInLast7Day();
          break;
        case Role.doctor:
          const doctor = await DoctorService.getInforByUserId(userId);
          result = await appointmentScheduleService.getCountInLast7DayForDoctor(doctor.departmentId._id);
          break;
        default:
          result = {}
      }
      res.status(ApiStatusCode.OK).json({
        status: ApiStatus.succes,
        data: result
      })
    } catch (error) {
      next(error)
    }
  }

  //GET
  // số lượng bệnh nhân nhập viện mỗi tháng
  public static getPatientsOnboardingInMonth = async (req, res, next) => {
    try {
      let result;
      const { userId, role } = req.user;
      switch(role) {
        case Role.admin:
          result = await boardingService.getTotalOnboardingPerMonth();
          break;
        case Role.doctor:
          const doctor = await DoctorService.getInforByUserId(userId);
          result = await boardingService.getTotalOnboardingPerMonthByDoctor(doctor.departmentId._id);
          break;
        default:
          result = {}
      }
      res.status(ApiStatusCode.OK).json({
        status: ApiStatus.succes,
        data: result
      })
    } catch (error) {
      next(error)
    }
  }

  //GET
  public static getDataNotification = async (req, res, next) => {
    try {
      const { userId, role } = req.user;
      let result;
      switch(role) {
        case Role.patient:
          const patient = await PatientService.findByUserId(userId);
          result = await appointmentScheduleService.getDataNotificationForPatient(patient._id);
          break;
        case Role.doctor:
          const doctor = await DoctorService.getInforByUserId(userId);
          result = await appointmentScheduleService.getDataNotificationForDoctor(doctor._id);
          break;
        default:
          result = {}
      }
      res.status(ApiStatusCode.OK).json({
        status: ApiStatus.succes,
        data: result
      })
    } catch (error) {
      next(error)
    }
  }

  //GET
  public static downloadStatisticExcel = async (req, res, next) => {
    try {
      const datasource = req.query.datasource;
      const { userId, role } = req.user;
      let fileName: string;
      let data: any;
      const _datetime = MomentTimezone.convertDDMMYYYCsv(new Date);

      switch(Number(datasource)) {
        case exportCsvType.doctorAccount:
          if(role === Role.admin) {
            data = await DoctorService.getAllCsv();
            fileName = "Danh-sach-bac-si-xuat-ngay-" + _datetime + ".csv";
            break;
          } else {
            const err: any = new Error("Không có dữ liệu");
            err.statusCode = ApiStatusCode.BadRequest;
            return next(err)
          }
        case exportCsvType.patientAccount:
          if(role === Role.admin) {
            data = await PatientService.getAllCsv();
            fileName = "Danh-sach-benh-nhan-xuat-ngay-" + _datetime + ".csv";
            break;
          } else {
            const err: any = new Error("Không có dữ liệu");
            err.statusCode = ApiStatusCode.BadRequest;
            return next(err)
          }
        case exportCsvType.patientIn:
          if (role === Role.doctor) {
            const doctor = await DoctorService.getInforByUserId(userId);
            data = await PatientService.getAllPatientOnBoardingCsv(doctor.departmentId, Onboarding.inpatient);
            fileName = "Danh-sach-benh-nhan-noi-tru-xuat-ngay-" + _datetime + ".csv";
            break;
          } else {
            const err: any = new Error("Không có dữ liệu");
            err.statusCode = ApiStatusCode.BadRequest;
            return next(err)
          }
        case exportCsvType.patientOut:
          if (role === Role.doctor) {
            const doctor = await DoctorService.getInforByUserId(userId);
            data = await PatientService.getAllPatientOnBoardingCsv(doctor.departmentId, Onboarding.outpatient);
            fileName = "Danh-sach-benh-nhan-ngoai-tru-xuat-ngay-" + _datetime + ".csv";
            break;
          } else {
            const err: any = new Error("Không có dữ liệu");
            err.statusCode = ApiStatusCode.BadRequest;
            return next(err)
          }
        case exportCsvType.historiesMedical:
          if (role === Role.doctor) {
            let _id = (await DoctorService.getInforByUserId(userId))._id;
            fileName = "Lich-su-kham-benh-xuat-ngay-" + _datetime + ".csv";
            data = await historiesService.getHistoryMedicalOfDoctorCsv(_id);
          } else {
            const err: any = new Error("Không có dữ liệu");
            err.statusCode = ApiStatusCode.BadRequest;
            return next(err)
          }
          break;  
        default:
          const err: any = new Error("Không có dữ liệu");
          err.statusCode = ApiStatusCode.BadRequest;
          return next(err)
      }
      const jsoncsvParse = new Parser();
      const csv = jsoncsvParse.parse(data);
      fs.writeFile(fileName, csv, function(err) {
        if(err) {
          next(err)
        }
      })
      res.attachment(fileName)
      res.status(ApiStatusCode.OK).send(csv);
    } catch (error) {
      next(error)
    }
  }

}