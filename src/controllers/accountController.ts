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
import { TableResponseNoData } from "../utils/constant";

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
}