import { Router } from 'express';
import Middlewares from '../middlewares';
import DepartmentController from '../controllers/departmentController';
import { Role } from '../models/Data/schema';

const departmentRoute = Router();

departmentRoute.route('/create').post(Middlewares.verifyToken, Middlewares.permission([Role.admin]),  DepartmentController.createDepartment);
departmentRoute.route('/getall').get(Middlewares.verifyToken, DepartmentController.getAllDepartment);

export default departmentRoute;