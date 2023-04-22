import bcrypt from 'bcryptjs';
import { createSecurity, createUser,findAndUpdateSercurityByUserId,findOneUser, findRefreshTokenByUserId } from "../services/authService";
import jwToken from '../helpers/jwt';
import { ApiStatus, ApiStatusCode } from '../models/Data/apiStatus';
import { validateReqBody } from '../utils/validateReqBody';
import ReqBody from '../models/Data/reqBody';
import { schemaFields } from '../models/Data/schema';

export const register = async (req, res, next) => {
    try {
        const verifyReqBody = validateReqBody(req, ReqBody.registerAdmin)
        if(!verifyReqBody.pass) {
            const err: any = new Error(verifyReqBody.message);
            err.statusCode = ApiStatusCode.BadRequest;
            return next(err)
        }
        const user = await createUser(req.body);
        const accessToken = jwToken.createAccessToken({ username: user.username});
        const refreshToken = jwToken.createRefreshToken({ username: user.username});
        await createSecurity({ userId: user._id, refreshToken});
        res.status(ApiStatusCode.OK).json({
            status: ApiStatus.succes,
            data: { 
                accessToken, 
                refreshToken, 
                userName: user.username, 
                role: user.role
            }
        })
    } catch (e) {
        next(e);
    }
}

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
            const accessToken = jwToken.createAccessToken({ username: user.username});
            const refreshToken = jwToken.createRefreshToken({ username: user.username});
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
            // ERROR: password is not correct
            const err: any = new Error('Password is not correct');
            err.statusCode = ApiStatusCode.BadRequest;
            return next(err)
        }
    } catch (error) {
        next(error)
    }
}

// get current user
// export const getCurrentUser = async (req, res, next) => {
//     try {
//         const data = { account: null}
//         if (req.user) {
//             const account = await Account.findOne({ _id: req.account.accountId});
//             data.user = { userName: account.name }
//         }
//         res.status(ApiStatusCode.OK).json({
//             status: "success",
//             data: data
//         })
//     } catch (err) {
//         res.json(err)
//     }
// }

// request new accessToken
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
            const accessToken = jwToken.createAccessToken({username: payload});
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