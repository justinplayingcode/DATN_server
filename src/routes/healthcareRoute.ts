import { Router } from 'express';
import Middlewares from '../middlewares';
import { Role } from '../utils/enum';
import HealthcareController from '../controllers/healthcareController';

const healthcareRoute = Router();

healthcareRoute.route('/getinfobyuserid').post(Middlewares.verifyToken, Middlewares.permission([Role.doctor]), HealthcareController.getPatientByUserId) //done
healthcareRoute.route('/registerpatient').post(Middlewares.verifyToken, Middlewares.permission([Role.doctor]), HealthcareController.registerPatient); //done
healthcareRoute.route('/searchinsurance').post(Middlewares.verifyToken, Middlewares.permission([Role.doctor]), HealthcareController.searchPatientByInsurance); //done
healthcareRoute.route("/getallpatientonbroading").post(Middlewares.verifyToken, Middlewares.permission([Role.doctor]), HealthcareController.getListPatientOnBoarding);
healthcareRoute.route("/gethistorymedical").post(Middlewares.verifyToken, Middlewares.permission([Role.doctor, Role.patient]), HealthcareController.getHistoryMedical);
// healthcareRoute.route("/createtestservice").post(Middlewares.verifyToken, Middlewares.permission([Role.admin]), HealthcareController.createTestService);
healthcareRoute.route("/alltestservice").get(Middlewares.verifyToken, HealthcareController.getListTestService);
export default healthcareRoute;