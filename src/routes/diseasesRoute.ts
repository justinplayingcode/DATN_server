import { Router } from 'express';
import Middlewares from '../middlewares';
import DiseasesController from '../controllers/diseasesController';
import { Role } from '../utils/enum';

const diseasesRoute = Router();

diseasesRoute.route('/getall').post(Middlewares.verifyToken, DiseasesController.getAllDiseases); //done
diseasesRoute.route('/creatediseases').post(Middlewares.verifyToken, Middlewares.permission([Role.admin]), DiseasesController.createDiseases); //done
diseasesRoute.route('/editdiseases').put(Middlewares.verifyToken, Middlewares.permission([Role.admin]), DiseasesController.editDiseases); //done
diseasesRoute.route('/picker').post(Middlewares.verifyToken, DiseasesController.pickerDisease) //done
diseasesRoute.route('/delete').put(Middlewares.verifyToken,Middlewares.permission([Role.admin]), DiseasesController.deleteDisease) //done

export default diseasesRoute;