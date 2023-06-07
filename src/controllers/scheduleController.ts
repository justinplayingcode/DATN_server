import mongoose from "mongoose";
import appointmentScheduleService from "../services/appointmentScheduleService";
import DoctorService from "../services/doctorService";
import PatientService from "../services/patientService";
import { TableResponseNoData } from "../utils/constant";
import { ApiStatus, ApiStatusCode, TableType, statusAppointment } from "../utils/enum";
import validateReqBody, { ReqBody } from "../utils/requestbody";
import HistoriesService from "../services/historiesService";

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
      if(status !== statusAppointment.wait) {
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
}