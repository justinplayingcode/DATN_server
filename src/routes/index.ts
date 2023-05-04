import { Router } from 'express';
import authRoute from "./authRoute";
import departmentRoute from "./departmentRoute";
import patientRoute from './patientRoute';

const routes = Router();

routes.use('/auth', authRoute);
routes.use('/department', departmentRoute);
routes.use('/patient', patientRoute);

export default routes;