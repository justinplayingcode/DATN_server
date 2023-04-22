import { IValidateReqBody } from "../models/Data/typeReqBody";

export const validateReqBody = (req, requiredFields: string[]): IValidateReqBody => {
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