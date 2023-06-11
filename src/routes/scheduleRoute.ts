import { Router } from 'express';
import { Role } from '../utils/enum';
import Middlewares from '../middlewares';
import ScheduleController from '../controllers/scheduleController';

const scheduleRoute = Router();

scheduleRoute.route("/schedulewait").post(Middlewares.verifyToken, Middlewares.permission([Role.doctor]), ScheduleController.scheduleWait); //done
scheduleRoute.route("/startschedulenormal").put(Middlewares.verifyToken, Middlewares.permission([Role.doctor]), ScheduleController.changeStatusToProcess);
scheduleRoute.route("/requestmedical").post(Middlewares.verifyToken, Middlewares.permission([Role.patient]), ScheduleController.patientRequestMedical); //done
scheduleRoute.route("/getallrequestmedical").post(Middlewares.verifyToken, Middlewares.permission([Role.doctor]), ScheduleController.getAllScheduleRequest);
scheduleRoute.route("/approverequestmedical").put(Middlewares.verifyToken, Middlewares.permission([Role.doctor]), ScheduleController.responseScheduleRequest);
scheduleRoute.route("/getlistrequestmedical").post(Middlewares.verifyToken, Middlewares.permission([Role.patient]), ScheduleController.getListRequestMedical); //done

export default scheduleRoute;