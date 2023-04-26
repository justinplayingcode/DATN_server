import { ICreateSecurity } from "../models/Data/typeReqBody";
import Security from "../models/Schema/Security";

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