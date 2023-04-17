import  jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';
import { createAccount,findOneAccount } from "../services/authService";

export const register = async (req, res, next) => {
    try {
        //req.body: name, email, password
        const account = await createAccount(req.body);
        const token = jwt.sign({accountId: account._id}, process.env.APP_SECRET); // tao token
        res.status(200).json({
            status:'success',
            data: { token, userName: account.username, role: account.role}
        }) // phan hoi
    } catch (e) {
        next(e);
    }
}

export const login = async (req, res, next) => {
    try {
        const account = await findOneAccount('username', req.body.username);
        if(!account) {
            const err = new Error('username is not correct');
            err.statusCode = 400;
            return next(err)
        }
        // neu co email => kiem tra password
        if (bcrypt.compareSync(req.body.password, account.password)) {
            const token = jwt.sign({accountId: account._id}, process.env.APP_SECRET); // tao token
            res.status(200).json({
                status: "succes",
                data: { token, username: account.username, role: account.role }
            })
        } else {
            // ERROR: password is not correct
            const err = new Error('Password is not correct');
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