import { Router } from 'express';
import authRoute from "./authRoute";
import departmentRoute from "./departmentRoute";
import accountRoute from './accountRoute';

const routes = Router();

routes.use('/auth', authRoute);
routes.use('/account', accountRoute);
routes.use('/department', departmentRoute);

export default routes;