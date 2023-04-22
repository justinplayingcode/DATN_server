import  jwt from "jsonwebtoken";
import dotenvConfig from "../config/dotenv.config";
dotenvConfig();

export const verifyToken = (req, res, next) => {
    // access Authorization from req header
    const authorization = req.header('authorization');
    if(!authorization) {
        // error: unauthorized
        const err: any = new Error('Unauthorized!');
        err.statusCode = 401;
        return next(err)
    } else {
        const token = authorization.replace('Bearer ', '');
        // verify token
        const { userId } = jwt.verify(token, process.env.APP_SECRET) as any;
        // assign to req
        req.user = { userId };
        next();
    }
}
