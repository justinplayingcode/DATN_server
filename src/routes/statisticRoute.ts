import { Router } from "express";
import Middlewares from "../middlewares";
import StatisticController from "../controllers/statisticController";
import { Role } from "../utils/enum";

const statistcRoute = Router();

statistcRoute.route('/doctorwithdepartment').get(Middlewares.verifyToken, Middlewares.permission([Role.admin]), StatisticController.getDoctorWithDepartment);
statistcRoute.route('/patientsindepartment').get(Middlewares.verifyToken, Middlewares.permission([Role.admin]), StatisticController.getPatientsOnboardingWithDepartment);
statistcRoute.route('/historieslast7day').get(Middlewares.verifyToken, Middlewares.permission([Role.admin, Role.doctor]), StatisticController.getTotalHistoryInLast7Day);
statistcRoute.route('/onboardinginmonth').get(Middlewares.verifyToken, Middlewares.permission([Role.admin, Role.doctor]), StatisticController.getPatientsOnboardingInMonth);
statistcRoute.route('/datanotification').get(Middlewares.verifyToken, Middlewares.permission([Role.patient, Role.doctor]), StatisticController.getDataNotification);
statistcRoute.route('/statisticexcel').get(Middlewares.verifyToken, Middlewares.permission([Role.admin, Role.doctor]), StatisticController.downloadStatisticExcel);

export default statistcRoute;