import { Router } from 'express';
import AuthController from "../controllers/authController";
import Middlewares from '../middlewares';

const authRoute = Router();

authRoute.route('/registeradmin').post(Middlewares.verifyToken, AuthController.registerAdmin);
authRoute.route('/login').post(AuthController.login);
authRoute.route('/').get(Middlewares.verifyToken, AuthController.getCurrentUser);
authRoute.route('/newtoken').post(AuthController.newAccessToken);
authRoute.route('/infocurrentuser').get(Middlewares.verifyToken, AuthController.getInfoUser);
authRoute.route('/edit').post(Middlewares.verifyToken, AuthController.editInfomationUser);

export default authRoute;