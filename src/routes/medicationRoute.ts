import { Router } from 'express';
import MedicationController from '../controllers/medicationController';
import Middlewares from '../middlewares';
import { Role } from '../utils/enum';

const medicationRoute = Router();

medicationRoute.route('/getallmedications').post(Middlewares.verifyToken, MedicationController.getAllMedication); //done
medicationRoute.route('/createmedication').post(Middlewares.verifyToken, Middlewares.permission([Role.admin]), MedicationController.createMedication); //done
medicationRoute.route('/editmedication').put(Middlewares.verifyToken, Middlewares.permission([Role.admin]), MedicationController.editMedication); //done
medicationRoute.route('/picker').post(Middlewares.verifyToken,  MedicationController.pickerMedication)

export default medicationRoute;