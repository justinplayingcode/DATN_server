import { Router } from 'express';
import AuthController from "../controllers/authController";
import Middlewares from '../middlewares';
import { Role } from '../models/Data/schema';

const authRoute = Router();

authRoute.route('/registeradmin').post(Middlewares.verifyToken, Middlewares.permission([Role.admin]), AuthController.registerAdmin);
authRoute.route('/login').post(AuthController.login);
authRoute.route('/').get(Middlewares.verifyToken, AuthController.getCurrentUser);
authRoute.route('/newtoken').post(AuthController.newAccessToken);
authRoute.route('/infocurrentuser').get(Middlewares.verifyToken, AuthController.getInfoUser);
authRoute.route('/edit').post(Middlewares.verifyToken, AuthController.editInfomationUser);

export default authRoute;