import Account from "../models/Account";

export const createAccount = async (bodyReq) => {
    return await Account.create(bodyReq);
}

export const findOneAccount = async (key, obj) => {
    return await Account.findOne({
        [key]: obj
    });
}
