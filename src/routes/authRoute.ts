import { Router as _Router } from 'express';
import { registerAdmin, login, getCurrentUser, newAccessToken } from "../controllers/authController";

const Router = _Router();

Router.route('/registeradmin').post(registerAdmin);
Router.route('/login').post(login);
Router.route('/').get(getCurrentUser);2
Router.route('/newtoken').post(newAccessToken);

export default Router;