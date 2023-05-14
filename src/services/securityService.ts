import { ClientSession, Schema } from "mongoose";
import Security from "../models/Schema/Security";

export default class SecurityService {
    public static registerCreateSecurity = async (userId: Schema.Types.ObjectId, session: ClientSession) => {
      try {
        const obj = {
            userId,
            refreshToken: ''
        }
        const newSecurity = new Security(obj);
        return await newSecurity.save({ session });
      } catch (error) {
        throw error;
      }
    }
    public static findAndUpdateSercurityByUserId = async (userId, refreshToken) => {
        return await Security.findOneAndUpdate( { userId }, { refreshToken })
    }
    public static findRefreshTokenByUserId = async (userId) => {
        const { refreshToken } = await Security.findOne({ userId })
        return refreshToken;
    }
}