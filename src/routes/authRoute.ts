import { Router as _Router } from 'express';
import { register, login } from "../controllers/authController";
// import { checkCurrentUser } from '../middlewares/checkCurrentUser';

const Router = _Router();

Router.route('/register').post(register);
Router.route('/login').post(login);
// Router.route('/').get(checkCurrentUser, getCurrentUser);

export default Router;