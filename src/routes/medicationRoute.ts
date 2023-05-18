import { Router } from 'express';
import MedicationController from '../controllers/medicationController';
import Middlewares from '../middlewares';

const medicationRoute = Router();

medicationRoute.route('/getallmedications').get(MedicationController.getAllMedication);
medicationRoute.route('/createmedication').post(Middlewares.verifyToken, MedicationController.createMedication);
medicationRoute.route('/editmedication').post(Middlewares.verifyToken, MedicationController.editMedication);

export default medicationRoute;