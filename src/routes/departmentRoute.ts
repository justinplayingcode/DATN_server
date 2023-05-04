import { Router } from 'express';
import Middlewares from '../middlewares';
import DepartmentController from '../controllers/departmentController';

const departmentRoute = Router();

departmentRoute.route('/create').post(Middlewares.verifyToken, DepartmentController.createDepartment);
departmentRoute.route('/getall').get(Middlewares.verifyToken, DepartmentController.getAllDepartment);

export default departmentRoute;