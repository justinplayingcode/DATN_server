import MomentTimezone from "../helpers/timezone";
import { ApiStatus, ApiStatusCode } from "../models/Data/apiStatus";
import ReqBody from "../models/Data/reqBody";
import { Role, schemaFields } from "../models/Data/schema";
import DoctorService from "../services/doctorService";
import SecurityService from "../services/securityService";
import UserService from "../services/userService";
import Convert from "../utils/convert";
import Message from "../utils/message";
import validateReqBody from "../utils/validateReqBody";

export default class DoctorController {
      //POST 
      public static registerDoctor = async (req, res, next) => {
        try {
            const { userId } = req.user;
            const { role } = await UserService.findOneUser(schemaFields._id, userId);
            if (role !== Role.admin) {
                const err: any = new Error(Message.NoPermission());
                err.statusCode = ApiStatusCode.Forbidden;
                return next(err)
            }
            validateReqBody(req, ReqBody.registerDoctor, next);
            const username = Convert.generateUsername(req.body.fullname, req.body.dateOfBirth, await UserService.getAllUserName());
            const password = Convert.generatePassword(req.body.fullname);
            const objUser = {
                username,
                email: req.body.email,
                password: password,
                role: Role.doctor,
                fullname: req.body.fullname,
                phonenumber: req.body.phonenumber,
                gender: req.body.gender,
                dateOfBirth: new Date(req.body.dateOfBirth),
                address: req.body.address,
                identification: req.body.identification
            };
            const newUser = await UserService.createUser(objUser);
            await SecurityService.registerCreateSecurity(newUser._id);
            const objDoctor = {
                userId: newUser._id,
                department: req.body.department,
                rank: req.body.rank,
                position: req.body.position
            };
            await DoctorService.createDoctor(objDoctor);
            res.status(ApiStatusCode.OK).json({
                status: ApiStatus.succes,
                data: { 
                    fullname: newUser.fullname,
                    username: newUser.username, 
                    password: password
                }
            });
        } catch (error) {
            next(error)
        }
    }
  // GET
  public static getAllDoctor = async (req, res, next) => {
      try {
          const { userId } = req.user;
          const { role } = await UserService.findOneUser(schemaFields._id, userId);
          if (role !== Role.admin) {
              const err: any = new Error(Message.NoPermission());
              err.statusCode = ApiStatusCode.Forbidden;
              return next(err)
          };
          const result = await DoctorService.getAll();
          const response = result.map(e => {
            const { dateOfBirth } = e.userId as any;
            const { name } = e.department as any;
            return {
              position: e.position,
              rank: e.rank,
              ...e.userId,
              department: name,
              dateOfBirth: MomentTimezone.convertDDMMYYY(dateOfBirth)
            }
          })
          res.status(ApiStatusCode.OK).json({
              status: ApiStatus.succes,
              data: response
          });
      } catch (error) {
          next(error);
      }
  }
}