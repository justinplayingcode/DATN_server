import bcrypt from 'bcryptjs';
import UserService from "../services/userService";
import jwToken, { IPayLoad } from '../helpers/jwt';
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
import Validate from '../utils/validate';

export default class AuthController {
    // POST
    public static registerAdmin = async (req, res, next) => {
      const session = await mongoose.startSession();
      session.startTransaction();
        try {
            validateReqBody(req, ReqBody.registerAdmin, next);
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
            const newUser = await UserService.createUser(objUser, session);
            const objSecurity = {
              userId: newUser._id,
              username,
              password,
              role: Role.admin,
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
            const account = await SecurityService.findOneAccount(schemaFields.username, req.body.username);
            if(!account) {
                const err: any = new Error('Tên đăng nhập không chính xác');
                err.statusCode = ApiStatusCode.BadRequest;
                return next(err)
            }
            if (bcrypt.compareSync(req.body.password, account.password)) {
                const accessToken = jwToken.createAccessToken({ userId: account.userId, role: account.role});
                const refreshToken = jwToken.createRefreshToken({ userId: account.userId, role: account.role});
                await SecurityService.findAndUpdateSercurityByUserId(account.userId, refreshToken);
                res.status(ApiStatusCode.OK).json({
                    status: ApiStatus.succes,
                    data: {
                        accessToken, 
                        refreshToken, 
                        username: account.username, 
                        role: account.role 
                    }
                })
            } else {
                const err: any = new Error('password không chính xác');
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
            const account = await SecurityService.findOneAccount(schemaFields.userId, userId);
            let data = { username: null, role: null };
            if(account) {
                data = { username: account.username, role: account.role }
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
            const rfToken = await SecurityService.findRefreshTokenByUserName(req.body.username);
            if (req.body.refreshToken && req.body.refreshToken === rfToken) {
                const payload = jwToken.getPayloadInRefreshToken(req.body.refreshToken) as IPayLoad;
                const accessToken = jwToken.createAccessToken({ userId: payload.userId, role: payload.role});
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
            const { userId, role } = req.user;
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
            switch(role) {
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

    //POST
    public static editInfomationUser = async (req, res, next) => {
      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        const { userId } = req.user;
        validateReqBody(req, ReqBody.editInfomationUser, next);
        if(!Validate.dateOfBirth(req.body.dateOfBirth)) {
          const err: any = new Error(Message.invalidDateOfBirth);
          err.statusCode = ApiStatusCode.BadRequest;
          return next(err)
        }
        const { dateOfBirth, ...obj } = req.body;
        const user = {
          ...obj,
          dateOfBirth: new Date(dateOfBirth)
        }
        const userUpdate = await UserService.updateOne(userId, user, session)
        await session.commitTransaction();
        session.endSession();
        if(!userUpdate) {
          res.status(ApiStatusCode.OK).json({
            status: ApiStatus.fail,
            message: `Not found user: ${req.body.fullname}`
          })
        } else {
          res.status(ApiStatusCode.OK).json({
            status: ApiStatus.succes,
            data: userUpdate
          })
        }
      } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
      }
    }
}