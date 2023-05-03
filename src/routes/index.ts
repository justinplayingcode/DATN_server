import {Router as _Router} from 'express';
import authRoute from "./authRoute";
import departmentRoute from "./departmentRoute";

const routes = _Router();

routes.use('/auth', authRoute);
routes.use('/department', departmentRoute);

export default routes;