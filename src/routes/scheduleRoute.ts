import { Router } from 'express';
import { IsUploadFor, Role } from '../utils/enum';
import Middlewares from '../middlewares';
import ScheduleController from '../controllers/scheduleController';

const scheduleRoute = Router();

scheduleRoute.route("/schedulewait").post(Middlewares.verifyToken, Middlewares.permission([Role.doctor]), ScheduleController.scheduleWait); //done
scheduleRoute.route("/requestmedical").post(Middlewares.verifyToken, Middlewares.permission([Role.patient]), ScheduleController.patientRequestMedical); //done
scheduleRoute.route("/getallrequestmedical").post(Middlewares.verifyToken, Middlewares.permission([Role.doctor]), ScheduleController.getAllScheduleRequest); //done
scheduleRoute.route("/approverequestmedical").put(Middlewares.verifyToken, Middlewares.permission([Role.doctor]), ScheduleController.responseScheduleRequest); // done
scheduleRoute.route("/getlistrequestmedical").post(Middlewares.verifyToken, Middlewares.permission([Role.patient]), ScheduleController.getListRequestMedical); //done
scheduleRoute.route("/getallapproverequestmedical").post(Middlewares.verifyToken, Middlewares.permission([Role.doctor]), ScheduleController.getAllApproveRequestScheduleOfDoctor) //done
scheduleRoute.route("/startschedulenormal").put(Middlewares.verifyToken, Middlewares.permission([Role.doctor]), ScheduleController.changeStatusToProcess);
scheduleRoute.route("/testingrequest").put(Middlewares.verifyToken, Middlewares.permission([Role.doctor]), ScheduleController.changeToTesting);
scheduleRoute.route("/alltestrequest").post(Middlewares.verifyToken, Middlewares.permission([Role.doctor]), ScheduleController.getAllTestRequestBeforeTesting);
scheduleRoute.route("/starttesting").post(Middlewares.verifyToken, Middlewares.permission([Role.doctor]), ScheduleController.testingToProcess);
scheduleRoute.route("/donetesting").post(Middlewares.verifyToken, Middlewares.permission([Role.doctor]), Middlewares.upload(IsUploadFor.testResult, 'detailsFileClouds'), ScheduleController.testingToWait); 
scheduleRoute.route("/done").post(Middlewares.verifyToken, Middlewares.permission([Role.doctor]), ScheduleController.changeToDone); //done
scheduleRoute.route("/doctorrequestschedule").post(Middlewares.verifyToken, Middlewares.permission([Role.doctor]), ScheduleController.doctorRequestScheduleForPatientIn); //done


export default scheduleRoute;