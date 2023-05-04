import { Router } from 'express';
import Middlewares from '../middlewares';
import PatientController from '../controllers/patientController';

const patientRoute = Router();

patientRoute.route('/searchinsurance').post(Middlewares.verifyToken, PatientController.searchPatientByInsurance);

export default patientRoute;