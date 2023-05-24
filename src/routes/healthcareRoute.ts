import { Router } from 'express';
import Middlewares from '../middlewares';
import PatientController from '../controllers/patientController';
import { Role } from '../models/Data/schema';

const healthcareRoute = Router();

healthcareRoute.route('/getallpatient').post(Middlewares.verifyToken, Middlewares.permission([Role.doctor]), PatientController.getAllPatientWait)
healthcareRoute.route('/getinfobyuserid').post(Middlewares.verifyToken, Middlewares.permission([Role.doctor]),PatientController.getPatientByUserId)
healthcareRoute.route('/registerpatient').post(Middlewares.verifyToken, Middlewares.permission([Role.doctor]), PatientController.registerPatient);
healthcareRoute.route('/searchinsurance').post(Middlewares.verifyToken, Middlewares.permission([Role.doctor]), PatientController.searchPatientByInsurance);

export default healthcareRoute;