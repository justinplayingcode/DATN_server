import { Router } from 'express';
import authRoute from "./authRoute";
import departmentRoute from "./departmentRoute";
import accountRoute from './accountRoute';
import healthcareRoute from './healthcareRoute';
import medicationRoute from './medicationRoute';
import diseasesRoute from './diseasesRoute';
import scheduleRoute from './scheduleRoute';
import statistcRoute from './statisticRoute';
import postsRoute from './postRoute';

const routes = Router();

routes.use('/auth', authRoute);
routes.use('/account', accountRoute);
routes.use('/department', departmentRoute);
routes.use('/healthcare', healthcareRoute);
routes.use('/medication', medicationRoute);
routes.use('/diseases', diseasesRoute);
routes.use('/schedule', scheduleRoute);
routes.use('/statistic', statistcRoute);
routes.use('/posts', postsRoute);

export default routes;