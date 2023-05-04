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
            const result = await PatientService.findOneByInsurance(req.body.insurance);
            res.status(ApiStatusCode.OK).json({
                status: ApiStatus.succes,
                data: result
                // confirm lại xem data cần trả những gì 
            });
        } catch (error) {
            next(error);
        }
    }
}