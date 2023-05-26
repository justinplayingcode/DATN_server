import { Router } from 'express';
import Middlewares from '../middlewares';
import DiseasesController from '../controllers/diseasesController';
import { Role } from '../models/Data/schema';

const diseasesRoute = Router();

diseasesRoute.route('/getalldiseases').get(DiseasesController.getAllDiseases);
diseasesRoute.route('/creatediseases').post(Middlewares.verifyToken, Middlewares.permission([Role.admin]), DiseasesController.createDiseases);
diseasesRoute.route('/editdiseases').post(Middlewares.verifyToken, Middlewares.permission([Role.admin]), DiseasesController.editDiseases);

export default diseasesRoute;