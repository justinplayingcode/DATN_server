import { ApiStatusCode } from "../models/Data/apiStatus";
import { IValidateReqBody } from "../models/Data/objModel";

const validate = (req, requiredFields: string[]): IValidateReqBody => {
    const missingFields = [];
    requiredFields.forEach((field) => {
        if (!(field in req.body)) {
            missingFields.push(field);
        }
    });
    const result: IValidateReqBody = {
        pass: true
    }
    if (missingFields.length > 0) {
        result.pass = false;
        result.message = `Missing required field(s): ${missingFields.join(', ')}`;
    }
    return result
};

const validateReqBody = (req, requiredFields: string[], next) => {
    const verifyReqBody = validate(req, requiredFields)
    if(!verifyReqBody.pass) {
        const err: any = new Error(verifyReqBody.message);
        err.statusCode = ApiStatusCode.BadRequest;
        return next(err)
    }
}

export default validateReqBody