import { Router } from 'express';
import Middlewares from '../middlewares';
import { Role } from '../utils/enum';
import HealthcareController from '../controllers/healthcareController';

const healthcareRoute = Router();

healthcareRoute.route('/getinfobyuserid').post(Middlewares.verifyToken, Middlewares.permission([Role.doctor]), HealthcareController.getPatientByUserId) //done
healthcareRoute.route('/registerpatient').post(Middlewares.verifyToken, Middlewares.permission([Role.doctor]), HealthcareController.registerPatient); //done
healthcareRoute.route('/searchinsurance').post(Middlewares.verifyToken, Middlewares.permission([Role.doctor]), HealthcareController.searchPatientByInsurance); //done

export default healthcareRoute;