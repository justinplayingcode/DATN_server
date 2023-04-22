import bcrypt from 'bcryptjs';
import { createUser,findOneUser } from "../services/authService";
import jwToken from '../utils/jwt';
import { ApiStatus, ApiStatusCode } from '../models/Data/apiStatus';
import { ICreateAdmin, ILogin } from '../models/Data/reqbody';

export const register = async (req, res, next) => {
    try {
        let newUser: ICreateAdmin = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role,
            avatar: req.body.avatar
        }
        const user = await createUser(newUser);
        const param = {
            userId: user._id,
            username: user.username,
            role: user.role
        }; 
        const token = jwToken.createAccessToken(param);
        res.status(ApiStatusCode.OK).json({
            status: ApiStatus.succes,
            data: { token, userName: user.username, role: user.role}
        }) // phan hoi
    } catch (e) {
        next(e);
    }
}

export const login = async (req, res, next) => {
    try {
        let reqbody: ILogin = {
            username: req.body.username,
            password: req.body.password
        }
        const user = await findOneUser('username', reqbody.username);
        if(!user) {
            const err: any = new Error('username is not correct');
            err.statusCode = ApiStatusCode.BadRequest;
            return next(err)
        }
        // neu co email => kiem tra password
        if (bcrypt.compareSync(req.body.password, user.password)) {
            const param = {
                userId: user._id,
                username: user.username,
                role: user.role
            }; 
            const token = jwToken.createAccessToken(param);
            res.status(ApiStatusCode.OK).json({
                status: ApiStatus.succes,
                data: { token, username: user.username, role: user.role }
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