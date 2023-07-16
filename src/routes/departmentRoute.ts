import { Router } from 'express';
import Middlewares from '../middlewares';
import DepartmentController from '../controllers/departmentController';
// import { Role } from '../utils/enum';

const departmentRoute = Router();

// departmentRoute.route('/create').post(Middlewares.verifyToken, Middlewares.permission([Role.admin]),  DepartmentController.createDepartment); //done
departmentRoute.route('/getall').get(Middlewares.verifyToken, DepartmentController.getAllDepartment); //done
departmentRoute.route('/getall').post(Middlewares.verifyToken, DepartmentController.getAllForTable); //done
departmentRoute.route('/getalldoctors').post(Middlewares.verifyToken, DepartmentController.getAllDoctorsInDepartment) // 

export default departmentRoute;