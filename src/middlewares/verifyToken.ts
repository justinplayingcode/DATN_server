import  jwt from "jsonwebtoken";
// import dotenvConfig from "../config/dotenv.config";
import { ApiStatusCode } from "../models/Data/apiStatus";
// dotenvConfig();

export const verifyToken = (req, res, next) => {
    const authorization = req.header('authorization');
    if(!authorization) {
        const err: any = new Error('No token provided!');
        err.statusCode = ApiStatusCode.Forbidden;
        return next(err)
    } else {
        const token = authorization.replace('Bearer ', '');
        try {
            const { userId } = jwt.verify(token, process.env.APP_SECRET) as any;
            req.user = userId;
            next();
        } catch (err) {
            if(err.name === 'TokenExpiredError') {
                err.message = 'TokenExpiredError';
                err.statusCode = ApiStatusCode.TokenExpiredError;
            } else {
                err.message = "Unauthorized!";
                err.statusCode = ApiStatusCode.Unauthorized;
            }
            next(err)
        }
    }
}
