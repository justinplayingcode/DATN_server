import mongoose from "mongoose";
import MomentTimezone from "../helpers/timezone";
import { ApiStatus, ApiStatusCode } from "../models/Data/apiStatus";
import ReqBody from "../models/Data/reqBody";
import { Role, schemaFields, statusAppointment } from "../models/Data/schema";
import HealthService from "../services/healthService";
import PatientService from "../services/patientService";
import SecurityService from "../services/securityService";
import UserService from "../services/userService";
import Convert from "../utils/convert";
import Message from "../utils/message";
import validateReqBody from "../utils/validateReqBody";

export default class PatientController {
    //POST 
    public static registerPatient = async (req, res, next) => {
      const session = await mongoose.startSession();
      session.startTransaction();
        try {
            const { userId } = req.user;
            const { role } = await UserService.findOneUser(schemaFields._id, userId);
            if (role !== Role.doctor) {
                const err: any = new Error(Message.NoPermission());
                err.statusCode = ApiStatusCode.Forbidden;
                return next(err)
            }
            validateReqBody(req, ReqBody.registerPatient, next);
            if (req.body.userId) {
                await PatientService.findOneAndUpdateDepartment(req.body.userId, req.body.department);
                res.status(ApiStatusCode.OK).json({
                    status: ApiStatus.succes,
                });
            } else {
                const username = Convert.generateUsername(req.body.fullname, req.body.dateOfBirth, await UserService.getAllUserName());
                const password = Convert.generatePassword(req.body.fullname);
                const objUser = {
                    username,
                    email: req.body.email,
                    password: password,
                    role: Role.patient,
                    fullname: req.body.fullname,
                    phonenumber: req.body.phonenumber,
                    gender: req.body.gender,
                    dateOfBirth: new Date(req.body.dateOfBirth),
                    address: req.body.address,
                    identification: req.body.identification
                };
                const newUser = await UserService.createUser(objUser,session);
                await SecurityService.registerCreateSecurity(newUser._id);
                const objPatient = {
                    userId: newUser._id,
                    boarding: false,
                    insurance: req.body.insurance,
                    department: req.body.department,
                    hospitalization: 1,
                    status: statusAppointment.wait
                }
                const { _id } = await PatientService.createPatient(objPatient);
                await HealthService.createDefault(_id);
                await session.commitTransaction();
                session.endSession();
                res.status(ApiStatusCode.OK).json({
                    status: ApiStatus.succes,
                    data: { 
                        fullname: newUser.fullname,
                        username: newUser.username, 
                        password: password
                    }
                });
            }
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            next(error)
        }
    }
    // POST
    public static searchPatientByInsurance = async (req, res, next) => {
        try {
            const { userId } = req.user;
            const { role } = await UserService.findOneUser(schemaFields._id, userId);
            if (role === Role.patient) {
                const err: any = new Error(Message.NoPermission());
                err.statusCode = ApiStatusCode.Forbidden;
                return next(err)
            };
            validateReqBody(req, ReqBody.searchPatientByInsurance, next);
            const patients = await PatientService.findOneByInsurance(req.body.insurance);
            const result = patients.map(patient => {
                const user = patient.userId as any;
                return {
                    ...patient.userId,
                    dateOfBirth: MomentTimezone.convertDDMMYYY(user.dateOfBirth)
                }
            })
            res.status(ApiStatusCode.OK).json({
                status: ApiStatus.succes,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    //POST
    public static getPatientByUserId = async (req, res, next) => {
        try {
            const { userId } = req.user;
            const { role } = await UserService.findOneUser(schemaFields._id, userId);
            if (role === Role.patient) {
                const err: any = new Error(Message.NoPermission());
                err.statusCode = ApiStatusCode.Forbidden;
                return next(err)
            };
            validateReqBody(req, ReqBody.getPatientByUserId, next);
            const patient = await PatientService.findOneByUserId(req.body.userId);
            const { dateOfBirth } = patient.userId as any;
            const result = {
                ...patient.userId,
                dateOfBirth: MomentTimezone.convertDDMMYYY(dateOfBirth),
                insurance: patient.insurance
            }
            res.status(ApiStatusCode.OK).json({
                status: ApiStatus.succes,
                data: result
            });
        } catch (error) {
            next(error)
        }
    }

    //GET
    public static getAllPatient = async (req, res, next) => {
        try {
            const { userId } = req.user;
            const { role } = await UserService.findOneUser(schemaFields._id, userId);
            if (role !== Role.admin) {
                const err: any = new Error(Message.NoPermission());
                err.statusCode = ApiStatusCode.Forbidden;
                return next(err)
            };
            const patients = await PatientService.getAll();
            const response = patients.map(patient => {
                const { dateOfBirth, fullname, address, identification } = patient.userId as any;
                return {
                    fullname,
                    address,
                    dateOfBirth: MomentTimezone.convertDDMMYYY(dateOfBirth),
                    identification,
                    insurance: patient.insurance
                }
            })
            res.status(ApiStatusCode.OK).json({
                status: ApiStatus.succes,
                data: response
            });
        } catch (error) {
            next(error)
        }
    }

    //POST
    public static getAllPatientWait = async (req, res, next) => {
        try {
            const { userId } = req.user;
            const { role } = await UserService.findOneUser(schemaFields._id, userId);
            if (role !== Role.doctor) {
                const err: any = new Error(Message.NoPermission());
                err.statusCode = ApiStatusCode.Forbidden;
                return next(err)
            };
            validateReqBody(req, ReqBody.getAllPatientWait, next);
            const patients = await PatientService.getAllWait(req.body.boarding);
            const result = patients.map(patient => {
                const { dateOfBirth, fullname, address, identification } = patient.userId as any;
                return {
                    fullname,
                    address,
                    dateOfBirth: MomentTimezone.convertDDMMYYY(dateOfBirth),
                    identification,
                    insurance: patient.insurance
                }
            })
            res.status(ApiStatusCode.OK).json({
                status: ApiStatus.succes,
                data: result
            });
        } catch (e) {
            next(e)
        }
    }
}