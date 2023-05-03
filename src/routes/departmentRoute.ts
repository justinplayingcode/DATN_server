import { Router as _Router } from 'express';
import Middlewares from '../middlewares';
import DepartmentController from '../controllers/departmentController';

const Router = _Router();

Router.route('/create').post(Middlewares.verifyToken, DepartmentController.createDepartment);
Router.route('/getall').get(Middlewares.verifyToken, DepartmentController.getAllDepartment);

export default Router;