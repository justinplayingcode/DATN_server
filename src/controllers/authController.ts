import bcrypt from 'bcryptjs';
import { createUser, findOneUser } from "../services/userService";
import jwToken from '../helpers/jwt';
import { ApiStatus, ApiStatusCode } from '../models/Data/apiStatus';
import { validateReqBody } from '../utils/validateReqBody';
import ReqBody from '../models/Data/reqBody';
import { schemaFields } from '../models/Data/schema';
import { createSecurity, findAndUpdateSercurityByUserId, findRefreshTokenByUserId } from '../services/securityService';

// POST
export const registerAdmin = async (req, res, next) => { // admin
    try {
        const verifyReqBody = validateReqBody(req, ReqBody.registerAdmin)
        if(!verifyReqBody.pass) {
            const err: any = new Error(verifyReqBody.message);
            err.statusCode = ApiStatusCode.BadRequest;
            return next(err)
        }
        const user = await createUser(req.body);
        const accessToken = jwToken.createAccessToken({ userId: user._id});
        const refreshToken = jwToken.createRefreshToken({ userId: user._id});
        await createSecurity({ userId: user._id, refreshToken});
        res.status(ApiStatusCode.OK).json({
            status: ApiStatus.succes,
            data: { 
                accessToken, 
                refreshToken, 
                username: user.username, 
                role: user.role
            }
        })
    } catch (e) {
        next(e);
    }
}

// POST
export const login = async (req, res, next) => {
    try {
        const verifyReqBody = validateReqBody(req, ReqBody.login)
        if(!verifyReqBody.pass) {
            const err: any = new Error(verifyReqBody.message);
            err.statusCode = ApiStatusCode.BadRequest;
            return next(err)
        }
        const user = await findOneUser(schemaFields.username, req.body.username);
        if(!user) {
            const err: any = new Error('username is not correct');
            err.statusCode = ApiStatusCode.BadRequest;
            return next(err)
        }
        if (bcrypt.compareSync(req.body.password, user.password)) {
            const accessToken = jwToken.createAccessToken({ userId: user._id});
            const refreshToken = jwToken.createRefreshToken({ userId: user._id});
            await findAndUpdateSercurityByUserId(user._id, refreshToken);
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

// get current user
// GET
export const getCurrentUser = async (req, res, next) => {
    const Authorization = req.header('authorization');
    if (!Authorization) {
        const err: any = new Error('Unauthorized!');
        err.statusCode = ApiStatusCode.Unauthorized;
        return next(err);
    } else {
        const token = Authorization.replace('Bearer ', "");
        try {
            const payload = jwToken.getPayLoadInAccessToken(token);
            const user = await findOneUser(schemaFields._id, payload);
            let data: { username: any; role: any; };
            if(!user) {
                data = { username: null, role: null }
            }
            data = { username: user.username, role: user.role }
            res.status(ApiStatusCode.OK).json({
                status: ApiStatus.succes,
                data: data
            })
        } catch (err) {
            if(err.name === 'TokenExpiredError') {
                err.message = 'TokenExpiredError';
                err.statusCode = ApiStatusCode.TokenExpiredError;
            }
            next(err)
        }
    }
}

// request new accessToken
// POST
export const newAccessToken = async (req, res, next) => {
    try {
        const verifyReqBody = validateReqBody(req, ReqBody.newAccessToken)
        if(!verifyReqBody.pass) {
            const err: any = new Error(verifyReqBody.message);
            err.statusCode = ApiStatusCode.BadRequest;
            return next(err)
        }
        const { _id } = await findOneUser(schemaFields.username, req.body.username)
        const rfToken = await findRefreshTokenByUserId(_id);
        if (req.body.refreshToken && req.body.refreshToken === rfToken) {
            const payload = jwToken.getPayloadInRefreshToken(req.body.refreshToken);
            const accessToken = jwToken.createAccessToken({userId: payload});
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