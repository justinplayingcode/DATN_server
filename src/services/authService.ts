import { ICreateAdmin, ICreateSecurity } from "../models/Data/typeReqBody";
import Security from "../models/Schema/Security";
import User from "../models/Schema/User";

export const createUser = async (bodyReq: ICreateAdmin) => {
    return await User.create(bodyReq);
}

export const findOneUser = async (key, obj) => {
    return await User.findOne({
        [key]: obj
    });
}

export const createSecurity = async (obj: ICreateSecurity) => {
    return await Security.create(obj)
}

export const findAndUpdateSercurityByUserId = async (userId, refreshToken) => {
    return await Security.findOneAndUpdate( { userId }, { refreshToken })
}

export const findRefreshTokenByUserId = async (userId) => {
    const { refreshToken } = await Security.findOne({ userId })
    return refreshToken;
}