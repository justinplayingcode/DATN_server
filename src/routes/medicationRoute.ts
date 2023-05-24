import { Router } from 'express';
import MedicationController from '../controllers/medicationController';
import Middlewares from '../middlewares';
import { Role } from '../models/Data/schema';

const medicationRoute = Router();

medicationRoute.route('/getallmedications').get(MedicationController.getAllMedication);
medicationRoute.route('/createmedication').post(Middlewares.verifyToken, Middlewares.permission([Role.admin]), MedicationController.createMedication);
medicationRoute.route('/editmedication').post(Middlewares.verifyToken, Middlewares.permission([Role.admin]), MedicationController.editMedication);

export default medicationRoute;