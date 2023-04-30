import { Router as _Router } from 'express';
import { registerAdmin, login, getCurrentUser } from "../controllers/authController";

const Router = _Router();

Router.route('/registeradmin').post(registerAdmin);
Router.route('/login').post(login);
Router.route('/').get(getCurrentUser);

export default Router;