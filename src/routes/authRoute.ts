import { Router } from 'express';
import AuthController from "../controllers/authController";
import Middlewares from '../middlewares';

const authRoute = Router();

authRoute.route('/registeradmin').post(Middlewares.verifyToken, AuthController.registerAdmin);
authRoute.route('/registerdoctor').post(Middlewares.verifyToken, AuthController.registerDoctor);
authRoute.route('/registerpatient').post(Middlewares.verifyToken, AuthController.registerPatient);
authRoute.route('/login').post(AuthController.login);
authRoute.route('/').get(Middlewares.verifyToken, AuthController.getCurrentUser);
authRoute.route('/newtoken').post(AuthController.newAccessToken);
authRoute.route('/infocurrentuser').get(Middlewares.verifyToken, AuthController.getInfoUser)

export default authRoute;