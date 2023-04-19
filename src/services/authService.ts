import User from "../models/User";

export const createUser = async (bodyReq) => {
    return await User.create(bodyReq);
}

export const findOneUser = async (key, obj) => {
    return await User.findOne({
        [key]: obj
    });
}
