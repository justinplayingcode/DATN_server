import { Router } from 'express';
import Middlewares from '../middlewares';
import AccountController from '../controllers/accountController';
import { Role } from '../utils/enum';

const accountRoute = Router();

accountRoute.route('/registerdoctor').post(Middlewares.verifyToken, Middlewares.permission([Role.admin]), AccountController.registerDoctor); //done
accountRoute.route('/getall').post(Middlewares.verifyToken, Middlewares.permission([Role.admin]), AccountController.getAll); // done
accountRoute.route('/changeinfodoctor').put(Middlewares.verifyToken, Middlewares.permission([Role.admin]), AccountController.changeInfoDoctor); // done
accountRoute.route('/detail').get(Middlewares.verifyToken, AccountController.getInfoByUserId); // done
accountRoute.route('/deletedoctor').put(Middlewares.verifyToken, Middlewares.permission([Role.admin]), AccountController.deleteDoctorByAdmin); // done

export default accountRoute;