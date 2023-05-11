import { Router } from 'express';
import Middlewares from '../middlewares';
import PatientController from '../controllers/patientController';
import DoctorController from '../controllers/doctorController';

const accountRoute = Router();

accountRoute.route('/searchinsurance').post(Middlewares.verifyToken, PatientController.searchPatientByInsurance);
accountRoute.route('/getalldoctor').get(Middlewares.verifyToken, DoctorController.getAllDoctor);
accountRoute.route('/getinfobyuserid').post(Middlewares.verifyToken, PatientController.getPatientByUserId)

export default accountRoute;