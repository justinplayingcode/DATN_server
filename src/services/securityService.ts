import { Schema } from "mongoose";
import Security from "../models/Schema/Security";

export default class SecurityService {
    public static registerCreateSecurity = async (userId: Schema.Types.ObjectId) => {
        const obj = {
            userId,
            refreshToken: ''
        }
        return await Security.create(obj)
    }
    public static findAndUpdateSercurityByUserId = async (userId, refreshToken) => {
        return await Security.findOneAndUpdate( { userId }, { refreshToken })
    }
    public static findRefreshTokenByUserId = async (userId) => {
        const { refreshToken } = await Security.findOne({ userId })
        return refreshToken;
    }
}