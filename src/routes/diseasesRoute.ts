import { Router } from 'express';
import Middlewares from '../middlewares';
import DiseasesController from '../controllers/diseasesController';

const diseasesRoute = Router();

diseasesRoute.route('/getalldiseases').get(DiseasesController.getAllDiseases);
diseasesRoute.route('/creatediseases').post(Middlewares.verifyToken, DiseasesController.createDiseases);
diseasesRoute.route('/editdiseases').post(Middlewares.verifyToken, DiseasesController.editDiseases);

export default diseasesRoute;