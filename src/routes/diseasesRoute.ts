import { Router } from 'express';
import Middlewares from '../middlewares';
import DiseasesController from '../controllers/diseasesController';
import { Role } from '../utils/enum';

const diseasesRoute = Router();

diseasesRoute.route('/getall').post(Middlewares.verifyToken, DiseasesController.getAllDiseases); //done
diseasesRoute.route('/creatediseases').post(Middlewares.verifyToken, Middlewares.permission([Role.admin]), DiseasesController.createDiseases); //done
diseasesRoute.route('/editdiseases').post(Middlewares.verifyToken, Middlewares.permission([Role.admin]), DiseasesController.editDiseases); //done

export default diseasesRoute;