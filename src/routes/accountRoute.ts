import { Router } from 'express';
import Middlewares from '../middlewares';
import PatientController from '../controllers/patientController';
import DoctorController from '../controllers/doctorController';
import { Role } from '../models/Data/schema';

const accountRoute = Router();

accountRoute.route('/registerdoctor').post(Middlewares.verifyToken, Middlewares.permission([Role.admin]), DoctorController.registerDoctor);
accountRoute.route('/getalldoctor').get(Middlewares.verifyToken, Middlewares.permission([Role.admin]), DoctorController.getAllDoctor);
accountRoute.route('/getallpatient').get(Middlewares.verifyToken, Middlewares.permission([Role.admin]), PatientController.getAllPatient)


export default accountRoute;