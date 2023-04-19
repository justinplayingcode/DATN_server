import  jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';
import { createUser,findOneUser } from "../services/authService";

export const register = async (req, res, next) => {
    try {
        //req.body: name, email, password
        const user = await createUser(req.body);
        const token = jwt.sign({userId: user._id}, process.env.APP_SECRET); // tao token
        res.status(200).json({
            status:'success',
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
            err.statusCode = 400;
            return next(err)
        }
        // neu co email => kiem tra password
        if (bcrypt.compareSync(req.body.password, user.password)) {
            const token = jwt.sign({userId: user._id}, process.env.APP_SECRET); // tao token
            res.status(200).json({
                status: "succes",
                data: { token, username: user.username, role: user.role }
            })
        } else {
            // ERROR: password is not correct
            const err: any = new Error('Password is not correct');
            err.statusCode = 400;
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
//         res.status(200).json({
//             status: "success",
//             data: data
//         })
//     } catch (err) {
//         res.json(err)
//     }
// }