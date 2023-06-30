import { ClientSession } from "mongoose";
import Security from "../schema/Security";
import { ICreateSecurity } from "../models/Security";

export default class SecurityService {
    public static registerCreateSecurity = async (obj: ICreateSecurity, session: ClientSession) => {
      try {
        const newAccount = {
            ...obj,
            refreshToken: ''
        }
        const newSecurity = new Security(newAccount);
        return await newSecurity.save({ session });
      } catch (error) {
        throw error;
      }
    }
    public static getAllUserName = async () => {
        const arr = await Security.find({});
        const usernames = [];
        arr.forEach((e) => {
            usernames.push(e.username)
        })
        return usernames
    }
    public static findAndUpdateSercurityByUserId = async (userId, refreshToken) => {
        return await Security.findOneAndUpdate( { userId }, { refreshToken })
    }
    public static findRefreshTokenByUserName = async (username: string) => {
        const { refreshToken } = await Security.findOne({ username })
        return refreshToken;
    }
    public static findOneAccount = async (key, obj) => {
      return await Security.findOne({ [key]: obj}).lean();
    }
    public static findAndUpdatePasswordById = async (id, password) => {
      return await Security.findByIdAndUpdate( id, { password }, {runValidators: true})
    }
}