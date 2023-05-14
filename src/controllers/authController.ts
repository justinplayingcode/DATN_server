import bcrypt from 'bcryptjs';
import UserService from "../services/userService";
import jwToken from '../helpers/jwt';
import { ApiStatus, ApiStatusCode } from '../models/Data/apiStatus';
import validateReqBody from '../utils/validateReqBody';
import ReqBody from '../models/Data/reqBody';
import { Role, schemaFields } from '../models/Data/schema';
import SecurityService from '../services/securityService';
import Message from '../utils/message';
import Convert from '../utils/convert';
import DoctorService from '../services/doctorService';
import PatientService from '../services/patientService';
import HealthService from '../services/healthService';
import MomentTimezone from '../helpers/timezone';
import mongoose from 'mongoose';

export default class AuthController {
    // POST
    public static registerAdmin = async (req, res, next) => {
      const session = await mongoose.startSession();
      session.startTransaction();

        try {
            const { userId } = req.user;
            const { role } = await UserService.findOneUser(schemaFields._id, userId);
            if (role !== Role.admin) {
                const err: any = new Error(Message.NoPermission());
                err.statusCode = ApiStatusCode.Forbidden;
                return next(err)
            }
            validateReqBody(req, ReqBody.registerAdmin, next);
            const username = Convert.generateUsername(req.body.fullname, req.body.dateOfBirth, await UserService.getAllUserName());
            const password = Convert.generatePassword(req.body.fullname);
            const objUser = {
                username,
                email: req.body.email,
                password: password,
                role: Role.admin,
                fullname: req.body.fullname,
                phonenumber: req.body.phonenumber,
                gender: req.body.gender,
                dateOfBirth: new Date(req.body.dateOfBirth),
                address: req.body.address,
                identification: req.body.identification
            };
            const newUser = await UserService.createUser(objUser, session);
            await SecurityService.registerCreateSecurity(newUser._id);

            await session.commitTransaction();
            session.endSession();
            res.status(ApiStatusCode.OK).json({
                status: ApiStatus.succes,
                data: { 
                    fullname: newUser.fullname,
                    username: newUser.username, 
                    password: password,
                }
            });
        } catch (error) {
          await session.abortTransaction();
          session.endSession();
          next(error);
        }
    }

    // POST 
    public static login = async (req, res, next) => {
        try {
            validateReqBody(req, ReqBody.login, next)
            const user = await UserService.findOneUser(schemaFields.username, req.body.username);
            if(!user) {
                const err: any = new Error('username is not correct');
                err.statusCode = ApiStatusCode.BadRequest;
                return next(err)
            }
            if (bcrypt.compareSync(req.body.password, user.password)) {
                const accessToken = jwToken.createAccessToken({ userId: user._id});
                const refreshToken = jwToken.createRefreshToken({ userId: user._id});
                await SecurityService.findAndUpdateSercurityByUserId(user._id, refreshToken);
                res.status(ApiStatusCode.OK).json({
                    status: ApiStatus.succes,
                    data: {
                        accessToken, 
                        refreshToken, 
                        username: user.username, 
                        role: user.role 
                    }
                })
            } else {
                const err: any = new Error('Password is not correct');
                err.statusCode = ApiStatusCode.BadRequest;
                return next(err)
            }
        } catch (error) {
            next(error)
        }
    }

    // GET
    public static getCurrentUser = async (req, res, next) => {
        try {
            const { userId } = req.user;
            const user = await UserService.findOneUser(schemaFields._id, userId);
            let data = { username: null, role: null };
            if(user) {
                data = { username: user.username, role: user.role }
            }
            res.status(ApiStatusCode.OK).json({
                status: ApiStatus.succes,
                data: data
            })
        } catch (err) {
            next(err)
        }
    }
    
    // POST
    public static newAccessToken = async (req, res, next) => {
        try {
            validateReqBody(req, ReqBody.newAccessToken, next)
            const { _id } = await UserService.findOneUser(schemaFields.username, req.body.username)
            const rfToken = await SecurityService.findRefreshTokenByUserId(_id);
            if (req.body.refreshToken && req.body.refreshToken === rfToken) {
                const payload = await jwToken.getPayloadInRefreshToken(req.body.refreshToken);
                const accessToken = jwToken.createAccessToken({ userId: payload });
                res.status(ApiStatusCode.OK).json({
                    status: ApiStatus.succes,
                    data: { accessToken }
                })
            } else {
                const err: any = new Error('Invalid refresh token');
                err.statusCode = ApiStatusCode.Forbidden;
                return next(err)
            }
        } catch (err) {
            next(err)
        }
    }

    //GET
    public static getInfoUser = async (req, res, next) => {
        try {
            const { userId } = req.user;
            const user = await UserService.findOneUser(schemaFields._id, userId);
            let response;
            const basicInfo = {
                fullname: user.fullname,
                email: user.email,
                gender: user.gender,
                avatar: user.avatar,
                phonenumber: user.phonenumber,
                address: user.address,
                identification: user.identification,
                dateOfBirth: MomentTimezone.convertDDMMYYY(user.dateOfBirth)
            }
            switch(user.role) {
                case Role.admin:
                    response = {
                        ...basicInfo
                    }
                    break;
                case Role.doctor:
                    const inforDoctor = await DoctorService.getInfor(userId);
                    const { _id: departmentId, name } = inforDoctor.department as any;
                    response = {
                      ...basicInfo,
                      ...inforDoctor,
                      department: name,
                      departmentId: departmentId
                    }
                    break;
                case Role.patient:
                    const patient = await PatientService.findOneCurrentInfoPatientByUserId(userId);
                    const health = await HealthService.findOneByPatientId(patient._id);
                    const { systolic, diastolic } = health.bloodPressure as any;
                    const { _id, ...infoPatient } = patient as any;
                    response = {
                        ...basicInfo,
                        ...infoPatient,
                        // idpatient: _id,
                        heartRate: health.heartRate,
                        temperature: health.temperature,
                        bloodPressureSystolic: systolic,
                        bloodPressureDiastolic: diastolic,
                        glucose: health.glucose,
                        weight: health.weight,
                        height: health.height
                    }
                    break;
            }
            res.status(ApiStatusCode.OK).json({
                status: ApiStatus.succes,
                data: response
            })
        } catch (error) {
            next(error)
        }
    }
}