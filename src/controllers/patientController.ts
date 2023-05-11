import MomentTimezone from "../helpers/timezone";
import { ApiStatus, ApiStatusCode } from "../models/Data/apiStatus";
import ReqBody from "../models/Data/reqBody";
import { Role, schemaFields } from "../models/Data/schema";
import PatientService from "../services/patientService";
import UserService from "../services/userService";
import Message from "../utils/message";
import validateReqBody from "../utils/validateReqBody";

export default class PatientController {
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
    public static getPatientByUserId =async (req, res, next) => {
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
            const { dateOfBirth, fullname, address, identification } = patient.userId as any;
            const result = {
                fullname,
                address,
                dateOfBirth: MomentTimezone.convertDDMMYYY(dateOfBirth),
                identification,
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
}