import {Router as _Router} from 'express';
import authRoute from "./authRoute";

const routes = _Router();

routes.use('/auth', authRoute);

export default routes;