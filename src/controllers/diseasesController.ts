import { ApiStatus, ApiStatusCode } from "../models/Data/apiStatus";
import ReqBody from "../models/Data/reqBody";
import DiseasesService from "../services/diseasesService";
import validateReqBody from "../utils/validateReqBody";

export default class DiseasesController {
  //GET
  public static getAllDiseases = async (req, res, next) => {
    try {
      const diseases = await DiseasesService.getAll();
      const result = diseases.map(e => {
        const { name, _id } = e.department as any;
        return {
          ...e,
          department: name,
          departmentId: _id
        }
      })
      res.status(ApiStatusCode.OK).json({
        status: ApiStatus.succes,
        data: result
    })
    } catch (error) {
      next(error)
    }
  }
  //POST
  public static createDiseases = async (req, res, next) => {
    try {
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
      validateReqBody(req, ReqBody.editDisases, next);
      const { id, ...obj } = req.body;
      const updateDiseases = await DiseasesService.editOne(id, obj);
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