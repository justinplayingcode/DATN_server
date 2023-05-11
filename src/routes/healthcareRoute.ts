import { Router } from 'express';
import Middlewares from '../middlewares';
import PatientController from '../controllers/patientController';

const healthcareRoute = Router();

healthcareRoute.route('/getallpatient').post(Middlewares.verifyToken, PatientController.getAllPatientWait)
healthcareRoute.route('/getinfobyuserid').post(Middlewares.verifyToken, PatientController.getPatientByUserId)
healthcareRoute.route('/registerpatient').post(Middlewares.verifyToken, PatientController.registerPatient);

export default healthcareRoute;