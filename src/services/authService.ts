import { ICreateAdmin } from "../models/Data/reqbody";
import User from "../models/Schema/User";

export const createUser = async (bodyReq: ICreateAdmin) => {
    return await User.create(bodyReq);
}

export const findOneUser = async (key, obj) => {
    return await User.findOne({
        [key]: obj
    });
}
