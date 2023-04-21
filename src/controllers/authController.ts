import bcrypt from 'bcryptjs';
import { createUser,findOneUser } from "../services/authService";
import { createAccessToken } from '../utils/jwt';
import { ApiStatus, ApiStatusCode } from '../models/Data/apiStatus';

export const register = async (req, res, next) => {
    try { // neu email la 1 chuoi trong thi bo email trong req.body di
        //req.body: name, email, password
        const user = await createUser(req.body);
        const param = {
            userId: user._id,
            username: user.username,
            role: user.role
        }; 
        const token = createAccessToken(param);
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
        const user = await findOneUser('username', req.body.username);
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
            const token = createAccessToken(param);
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