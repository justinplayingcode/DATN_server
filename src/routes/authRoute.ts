import { Router } from 'express';
import AuthController from "../controllers/authController";
import Middlewares from '../middlewares';
import { Role } from '../utils/enum';

const authRoute = Router();

// authRoute.route('/registeradmin').post(AuthController.registerAdmin); //done
authRoute.route('/login').post(AuthController.login); //done
authRoute.route('/').get(Middlewares.verifyToken, AuthController.getCurrentUser); //done
authRoute.route('/newtoken').post(AuthController.newAccessToken); //done
authRoute.route('/infocurrentuser').get(Middlewares.verifyToken, AuthController.getInfoUser); // done
authRoute.route('/edit').put(Middlewares.verifyToken, AuthController.editInfomationUser); //done
authRoute.route('/changepassword').put(Middlewares.verifyToken, AuthController.changePassword); //done
authRoute.route('/resetpassword').put(Middlewares.verifyToken, Middlewares.permission([Role.admin]) ,AuthController.resetPassword); //done

export default authRoute;