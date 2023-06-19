import MedicationService from "../services/medicationService";
import { TableResponseNoData, schemaFields } from "../utils/constant";
import { ApiStatus, ApiStatusCode, TableType } from "../utils/enum";
import validateReqBody, { ReqBody } from "../utils/requestbody";

export default class MedicationController {
  //GET
  public static getAllMedication = async (req, res, next) => {
    try {
      validateReqBody(req, ReqBody.getTableValues, next);
      let data;
      switch (req.body.tableType) {
        case TableType.medications:
          data = await MedicationService.getAll(req.body.page, req.body.pageSize, req.body.searchKey);
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
  public static createMedication = async (req, res, next) => {
    try {
      validateReqBody(req, ReqBody.createMedication, next);
      await MedicationService.create(req.body);
      res.status(ApiStatusCode.OK).json({
        status: ApiStatus.succes,
        data: "them moi thanh cong"
      })
    } catch (error) {
      next(error)
    }
  }
  //POST
  public static editMedication = async (req, res, next) => {
    try {
      validateReqBody(req, ReqBody.editMedication, next);
      const { id, ...obj } = req.body;
      const updateMedication = await MedicationService.editOne(id, obj)
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

  //POST
  public static pickerMedication = async (req, res, next) => {
    try {
      validateReqBody(req, [schemaFields.searchKey], next);
      const medications = await MedicationService.findOneByName(req.body.searchKey);
      res.status(ApiStatusCode.OK).json({
        status: ApiStatus.succes,
        data: medications
      })
    } catch (error) {
      next(error)
    }
  }
}