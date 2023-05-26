import mongoose from "mongoose";
import MomentTimezone from "../helpers/timezone";
import { ApiStatus, ApiStatusCode } from "../models/Data/apiStatus";
import ReqBody from "../models/Data/reqBody";
import { DepartmentType, Role, statusAppointment } from "../models/Data/schema";
import HealthService from "../services/healthService";
import PatientService from "../services/patientService";
import SecurityService from "../services/securityService";
import UserService from "../services/userService";
import Convert from "../utils/convert";
import Message from "../utils/message";
import validateReqBody from "../utils/validateReqBody";
import DepartmentService from "../services/departmentService";
import Validate from "../utils/validate";

export default class PatientController {
    //POST 
    public static registerPatient = async (req, res, next) => {
      const session = await mongoose.startSession();
      session.startTransaction();
        try {
            validateReqBody(req, ReqBody.registerPatient, next);
            if (req.body.userId) { // nghiên cứu check theo insurance
                await PatientService.registerFindOneAndUpdateDepartment(req.body.userId, req.body.department, session);
                res.status(ApiStatusCode.OK).json({
                    status: ApiStatus.succes,
                    message: 'update department successful'
                });
            } else {
                if(!Validate.dateOfBirth(req.body.dateOfBirth)) {
                  const err: any = new Error(Message.invalidDateOfBirth);
                  err.statusCode = ApiStatusCode.BadRequest;
                  return next(err)
                }
                const username = Convert.generateUsername(req.body.fullname, req.body.dateOfBirth, await SecurityService.getAllUserName());
                const password = Convert.generatePassword(req.body.fullname);
                const objUser = {
                    email: req.body.email,
                    fullname: req.body.fullname,
                    phonenumber: req.body.phonenumber,
                    gender: req.body.gender,
                    dateOfBirth: new Date(req.body.dateOfBirth),
                    address: req.body.address,
                    identification: req.body.identification
                };
                const newUser = await UserService.createUser(objUser,session);
                const objPatient = {
                  userId: newUser._id,
                  boarding: false,
                  insurance: req.body.insurance,
                  department: req.body.department,
                  hospitalization: 1,
                  status: statusAppointment.wait
                }
                const { _id } = await PatientService.createPatient(objPatient, session);
                await HealthService.createDefault(_id, session);
                const objSecurity = {
                  userId: newUser._id,
                  username,
                  password,
                  role: Role.patient,
                }
                await SecurityService.registerCreateSecurity(objSecurity, session);
                
                await session.commitTransaction();
                session.endSession();
                res.status(ApiStatusCode.OK).json({
                    status: ApiStatus.succes,
                    data: { 
                        fullname: newUser.fullname,
                        username, 
                        password
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
            validateReqBody(req, ReqBody.searchPatientByInsurance, next);
            const patients = await PatientService.findOneByInsuranceToRegister(req.body.insurance);
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
            const patients = await PatientService.getAll();
            const response = patients.map(patient => {
                const { dateOfBirth, email, fullname, phonenumber, gender, address, identification } = patient.userId as any;
                return {
                    fullname,
                    address,
                    identification,
                    dateOfBirth: MomentTimezone.convertDDMMYYY(dateOfBirth),
                    insurance: patient.insurance,
                    boarding: patient.boarding,
                    email,
                    phonenumber,
                    gender
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
            validateReqBody(req, ReqBody.getAllPatientWait, next);
            const departmentCode = await DepartmentService.findOneDepartmentCode(req.body.department);
            let patients: any[];
            switch(departmentCode) {
              case DepartmentType.tiepDon: 
                patients = await PatientService.getAllWaitRegister(req.body.boarding);
                break;
              case DepartmentType.canLamSang:
                patients = await PatientService.getAllTesting(req.body.boarding);
                break;
              default:
                patients = await PatientService.getAllWait(req.body.boarding, req.body.department);
                break;
            }
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