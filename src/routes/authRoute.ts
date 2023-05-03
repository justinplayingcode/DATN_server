import { Router as _Router } from 'express';
import AuthController from "../controllers/authController";
import Middlewares from '../middlewares';

const Router = _Router();

Router.route('/registeradmin').post(Middlewares.verifyToken, AuthController.registerAdmin);
Router.route('/registerdoctor').post(Middlewares.verifyToken, AuthController.registerDoctor);
Router.route('/registerpatient').post(Middlewares.verifyToken, AuthController.registerPatient);
Router.route('/login').post(AuthController.login);
Router.route('/').get(Middlewares.verifyToken, AuthController.getCurrentUser);
Router.route('/newtoken').post(AuthController.newAccessToken);
Router.route('/infocurrentuser').get(Middlewares.verifyToken, AuthController.getInfoUser)

export default Router;