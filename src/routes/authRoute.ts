import { Router as _Router } from 'express';
import { registerAdmin, login, getCurrentUser } from "../controllers/authController";
import { checkCurrentUser } from '../middlewares/checkCurrentUser';

const Router = _Router();

Router.route('/registeradmin').post(registerAdmin);
Router.route('/login').post(login);
Router.route('/').get(checkCurrentUser, getCurrentUser);

export default Router;