import { ApiStatus, ApiStatusCode } from "../models/Data/apiStatus";
import ReqBody from "../models/Data/reqBody";
import { Role, schemaFields } from "../models/Data/schema";
import DiseasesService from "../services/diseasesService";
import UserService from "../services/userService";
import Message from "../utils/message";
import validateReqBody from "../utils/validateReqBody";

export default class DiseasesController {
  //GET
  public static getAllDiseases = async (req, res, next) => {
    try {
      const Diseases = await DiseasesService.getAll();
      res.status(ApiStatusCode.OK).json({
        status: ApiStatus.succes,
        data: Diseases
    })
    } catch (error) {
      next(error)
    }
  }
  //POST
  public static createDiseases = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { role } = await UserService.findOneUser(schemaFields._id, userId);
      if (role !== Role.admin) {
          const err: any = new Error(Message.NoPermission());
          err.statusCode = ApiStatusCode.Forbidden;
          return next(err)
      }
      validateReqBody(req, ReqBody.createDisases, next);
      const Diseases = await DiseasesService.create(req.body);
      res.status(ApiStatusCode.OK).json({
        status: ApiStatus.succes,
        data: Diseases
      })
    } catch (error) {
      next(error)
    }
  }
  //POST
  public static editDiseases = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { role } = await UserService.findOneUser(schemaFields._id, userId);
      if (role !== Role.admin) {
          const err: any = new Error(Message.NoPermission());
          err.statusCode = ApiStatusCode.Forbidden;
          return next(err)
      }
      validateReqBody(req, ReqBody.editDisases, next);
      const obj = {
        code: req.body.code,
        name: req.body.name,
        symptom: req.body.symptom,
        prevention: req.body.prevention,
        department: req.body.prevention
      }
      const updateDiseases = await DiseasesService.editOne(req.body.id, obj)
      if(!updateDiseases) {
        res.status(ApiStatusCode.OK).json({
          status: ApiStatus.fail,
          message: `Not found Diseases: ${req.body.name}`
        })
      } else {
        res.status(ApiStatusCode.OK).json({
          status: ApiStatus.succes,
          data: updateDiseases
        })
      }
    } catch (error) {
      next(error)
    }
  }
}