import { Router } from 'express';
import Middlewares from '../middlewares';
import AccountController from '../controllers/accountController';
import { Role } from '../utils/enum';

const accountRoute = Router();

accountRoute.route('/registerdoctor').post(Middlewares.verifyToken, Middlewares.permission([Role.admin]), AccountController.registerDoctor); //done
accountRoute.route('/getall').post(Middlewares.verifyToken, Middlewares.permission([Role.admin]), AccountController.getAll); // done


export default accountRoute;