import { Router } from 'express';
import { Role } from '../utils/enum';
import Middlewares from '../middlewares';
import ScheduleController from '../controllers/scheduleController';

const scheduleRoute = Router();

scheduleRoute.route("/schedulewait").post(Middlewares.verifyToken, Middlewares.permission([Role.doctor]), ScheduleController.scheduleWait);


export default scheduleRoute;