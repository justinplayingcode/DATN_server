import appointmentScheduleService from "../services/appointmentScheduleService";
import { TableResponseNoData } from "../utils/constant";
import { ApiStatus, ApiStatusCode, TableType } from "../utils/enum";
import validateReqBody, { ReqBody } from "../utils/requestbody";

export default class ScheduleController {
  //POST
  public static scheduleWait = async (req, res, next) => {
    try {
      validateReqBody(req, ReqBody.getTableValues, next);
      let data;
      switch(req.body.tableType) {
        case TableType.scheduleNormalReception:
          data = await appointmentScheduleService.getSchedulesNormalWithReception(req.body.page, req.body.pageSize, req.body.searchKey);
          break;
        case TableType.scheduleNormalReception:
          break;
        case TableType.scheduleNormalReception:
          break;
        case TableType.scheduleNormalReception:
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