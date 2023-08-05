import { Router } from "express";
import Middlewares from "../middlewares";
import StatisticController from "../controllers/statisticController";
import { Role } from "../utils/enum";

const statistcRoute = Router();

statistcRoute.route('/doctorwithdepartment').get(Middlewares.verifyToken, Middlewares.permission([Role.admin]), StatisticController.getDoctorWithDepartment);

export default statistcRoute;