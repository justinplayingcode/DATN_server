import { ApiStatus, ApiStatusCode } from "../models/Data/apiStatus";
import ReqBody from "../models/Data/reqBody";
import { Role, schemaFields } from "../models/Data/schema";
import MedicationService from "../services/medicationService"
import UserService from "../services/userService";
import Message from "../utils/message";
import validateReqBody from "../utils/validateReqBody";

export default class MedicationController {
  //GET
  public static getAllMedication = async (req, res, next) => {
    try {
      const medications = await MedicationService.getAll();
      res.status(ApiStatusCode.OK).json({
        status: ApiStatus.succes,
        data: medications
    })
    } catch (error) {
      next(error)
    }
  }
  //POST
  public static createMedication = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { role } = await UserService.findOneUser(schemaFields._id, userId);
      if (role !== Role.admin) {
          const err: any = new Error(Message.NoPermission());
          err.statusCode = ApiStatusCode.Forbidden;
          return next(err)
      }
      validateReqBody(req, ReqBody.newMedication, next);
      const medication = await MedicationService.create(req.body);
      res.status(ApiStatusCode.OK).json({
        status: ApiStatus.succes,
        data: medication
      })
    } catch (error) {
      next(error)
    }
  }
  //POST
  public static editMedication = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { role } = await UserService.findOneUser(schemaFields._id, userId);
      if (role !== Role.admin) {
          const err: any = new Error(Message.NoPermission());
          err.statusCode = ApiStatusCode.Forbidden;
          return next(err)
      }
      validateReqBody(req, ReqBody.newMedication, next);
      const updateMedication = await MedicationService.editOne(req.body.name, req.body)
      if(!updateMedication) {
        res.status(ApiStatusCode.OK).json({
          status: ApiStatus.fail,
          message: `Not found medication: ${req.body.name}`
        })
      } else {
        res.status(ApiStatusCode.OK).json({
          status: ApiStatus.succes,
          data: updateMedication
        })
      }
    } catch (error) {
      next(error)
    }
  }
}