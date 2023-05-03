import jwToken from "../helpers/jwt";
import { ApiStatus, ApiStatusCode } from "../models/Data/apiStatus";

export default class Middlewares {
    public static verifyToken = (req, res, next) => {
        const authorization = req.header('Authorization');
        if(!authorization) {
            const err: any = new Error('No token provided!');
            err.statusCode = ApiStatusCode.Forbidden;
            return next(err)
        } else {
            const token = authorization.replace('Bearer ', '');
            try {
                const userId = jwToken.getPayLoadInAccessToken(token);
                req.user = { userId } ;
                next();
            } catch (err) {
                if(err.name === 'TokenExpiredError') {
                    err.message = 'TokenExpiredError';
                    err.statusCode = ApiStatusCode.Forbidden;
                } else {
                    err.message = "Unauthorized!";
                    err.statusCode = ApiStatusCode.Unauthorized;
                }
                next(err)
            }
        }
    }

    public static errorHandler = (err, req, res, next) => {
        err.statusCode = err.statusCode || ApiStatusCode.ServerError;
        // Duplicate
        if (err.code === 11000) {
            err.statusCode = ApiStatusCode.BadRequest;
            for (let p in err.keyValue) {
                err.message = `${p} already exists`;
            }
        }
        // ObjectId: not found
        if (err.kind === "ObjectId") {
            err.statusCode = ApiStatusCode.NotFound;
            err.message = `The ${req.originalUrl} is not found because of wrong ID`;
        }
        // Validation
        if(err.errors) {
            err.statusCode = ApiStatusCode.BadRequest;
            if (err.name !== "ValidationError") {
                err.message = [];
                for (let p in err.errors) {
                    err.message.push(err.errors[p].properties?.message);
                }
            } 
        }
        res.status(err.statusCode).json({
            status: ApiStatus.fail,
            message: err.message
        })
    }
}