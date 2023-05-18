import { Router } from 'express';
import authRoute from "./authRoute";
import departmentRoute from "./departmentRoute";
import accountRoute from './accountRoute';
import healthcareRoute from './healthcareRoute';
import medicationRoute from './medicationRoute';
import diseasesRoute from './diseasesRoute';

const routes = Router();

routes.use('/auth', authRoute);
routes.use('/account', accountRoute);
routes.use('/department', departmentRoute);
routes.use('/healthcare', healthcareRoute);
routes.use('/medication', medicationRoute);
routes.use('/diseases', diseasesRoute);

export default routes;