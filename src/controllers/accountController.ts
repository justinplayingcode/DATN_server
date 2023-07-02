import mongoose from "mongoose";
// import MomentTimezone from "../helpers/timezone";
import DoctorService from "../services/doctorService";
import SecurityService from "../services/securityService";
import UserService from "../services/userService";
import Convert from "../utils/convert";
import validateReqBody, { ReqBody } from "../utils/requestbody";
import Validate from "../utils/validate";
import { ApiStatus, ApiStatusCode, Role, TableType } from "../utils/enum";
import PatientService from "../services/patientService";
import { TableResponseNoData, schemaFields } from "../utils/constant";
import MomentTimezone from "../helpers/timezone";
import HealthService from "../services/healthService";

export default class AccountController {
  //POST 
  public static registerDoctor = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      validateReqBody(req, ReqBody.registerDoctor, next);
      Validate.validateDob(req.body.dateOfBirth, next);
      const username = Convert.generateUsername(req.body.fullname, req.body.dateOfBirth, await SecurityService.getAllUserName());
      const password = Convert.generatePassword(req.body.fullname);
      const objUser = {
          email: req.body.email,
          fullname: req.body.fullname,
          phonenumber: req.body.phonenumber,
          gender: req.body.gender,
          dateOfBirth: new Date(req.body.dateOfBirth),
          address: req.body.address,
          identification: req.body.identification
      };
      const newUser = await UserService.createUser(objUser, session);
      const objDoctor = {
        userId: newUser._id,
        departmentId: req.body.departmentId,
        rank: req.body.rank,
        position: req.body.position
      };
      await DoctorService.createDoctor(objDoctor, session);
      const objSecurity = {
        userId: newUser._id,
        username,
        password,
        role: Role.doctor,
      }
      await SecurityService.registerCreateSecurity(objSecurity, session);

      await session.commitTransaction();
      session.endSession();

      res.status(ApiStatusCode.OK).json({
          status: ApiStatus.succes,
          data: { 
              fullname: newUser.fullname,
              username, 
              password
          }
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error)
    }
  }

  // POST
  public static getAll = async (req, res, next) => {
      try {
          validateReqBody(req, ReqBody.getTableValues, next);
          let data;

          switch(req.body.tableType) {
            case TableType.doctorAccount:
              data = await DoctorService.getAll(req.body.page, req.body.pageSize, req.body.searchKey);
              break;
            case TableType.patientAccount:
              data = await PatientService.getAll(req.body.page, req.body.pageSize, req.body.searchKey);
              break;
            default:
              data = TableResponseNoData;
          }
          res.status(ApiStatusCode.OK).json({
              status: ApiStatus.succes,
              data: data
          });
      } catch (error) {
          next(error);
      }
  }
  //PUT
  public static changeInfoDoctor = async (req, res, next) => {
    try {
      validateReqBody(req, ReqBody.changeInfoDoctorByAdmin, next);
      const doctor = await DoctorService.getInforByUserId(req.body.userId);
      if(!doctor) {
        const err: any = new Error("Người dùng không tồn tại");
        err.statusCode = ApiStatusCode.BadRequest;
        return next(err);
      } else {
        const updateOoctor = {
          rank: Number(req.body.rank),
          position: Number(req.body.position),
          departmentId: req.body.departmentId
        };
        await DoctorService.changeInfoByAdmin(doctor._id, updateOoctor);
        res.status(ApiStatusCode.OK).json({
          status: ApiStatus.succes,
          message: "Thay đổi thông tin thành công"
        })
      }
    } catch (error) {
      next(error)
    }
  }

  public static getInfoByUserId = async (req, res, next) => {
    try {
      const user = await UserService.findOneUser(schemaFields._id, req.query.id);
      let response;
      const basicInfo = {
        fullname: user.fullname,
        email: user.email,
        gender: user.gender,
        avatar: user.avatar,
        phonenumber: user.phonenumber,
        address: user.address,
        identification: user.identification,
        dateOfBirth: MomentTimezone.convertDDMMYYY(user.dateOfBirth)
      }
      const acc = await SecurityService.findOneAccount(schemaFields.userId, req.query.id)
      switch(acc.role) {
      case Role.admin:
        response = basicInfo;
        break;
      case Role.doctor:
        const inforDoctor = await DoctorService.getInforByUserId(req.query.id);
        const { _id: departmentId, departmentName, departmentCode } = inforDoctor.departmentId as any;
        response = {
          ...basicInfo,
          ...inforDoctor,
          department: departmentName,
          departmentCode,
          departmentId
        }
        break;
      case Role.patient:
        const patient = await PatientService.findByUserId(req.query.id);
        const { _id, ...infoPatient } = patient as any;
        const health = await HealthService.findOneByPatientId(_id);
        response = {
            ...basicInfo,
            ...infoPatient,
            heartRate: health.heartRate,
            temperature: health.temperature,
            bloodPressureSystolic: health.bloodPressureSystolic,
            bloodPressureDiastolic: health.bloodPressureDiastolic,
            glucose: health.glucose,
            weight: health.weight,
            height: health.height
        }
        break;
      }
      res.status(ApiStatusCode.OK).json({
          status: ApiStatus.succes,
          data: response
      })
    } catch (error) {
      next(error)
    }
  }

  //upload avatar
  public static uploadAvatar = async (req, res, next) => {
    try {
      // const filePath = req.file.path;


      
    } catch (error) {
      next(error);
    }
  }
}