import DiseasesService from "../services/diseasesService";
import { TableResponseNoData } from "../utils/constant";
import { ApiStatus, ApiStatusCode, TableType } from "../utils/enum";
import validateReqBody, { ReqBody } from "../utils/requestbody";

export default class DiseasesController {
  //POST
  public static getAllDiseases = async (req, res, next) => {
    try {
      validateReqBody(req, ReqBody.getTableValues, next);
      let data;
      switch(req.body.tableType) {
        case TableType.diseases:
          data = await DiseasesService.getAll(req.body.page, req.body.pageSize, req.body.searchKey);
          break;
        default:
          data = TableResponseNoData
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