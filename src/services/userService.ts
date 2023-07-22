import { ClientSession } from "mongoose";
import User from "../schema/User";
import { schemaFields } from "../utils/constant";
import { ICreateUser, IEditUser } from "../models/User";

export default class UserService {
    public static createUser = async (obj: ICreateUser, session: ClientSession) => {
      try {
        const user = new User(obj);
        return user.save({ session });
      } catch (error) {
        throw error;
      }
    }
    public static findOneUser = async (key, obj) => {
        return await User.findOne({ [key]: obj}).lean();
    }
    public static updateOne = async (id, obj: IEditUser, session: ClientSession) => {
      const { identification, email } = obj;
      let updateObj: any = obj;
      const oldEmail = await this.findEmailById(id);
      const oldidentification = await this.findIdentificationById(id);
      if(email === oldEmail) {
        const { email, ...other } = obj;
        updateObj = other;
      }
      if (identification === oldidentification) {
        const { identification, ...other } = updateObj;
        updateObj = other;
      }
      return await User.findByIdAndUpdate( id, updateObj, { new: true, runValidators: true, session, select: `-__v -${schemaFields.username} -${schemaFields.password} -${schemaFields._id} -${schemaFields.role}`})
    }
    public static findById = async (id) => {
      return await User.findById(id).lean();
    }
    public static findEmailById = async (id) => {
      const { email } = await User.findById(id).lean();
      return email;
    }
    public static findIdentificationById = async (id) => {
      const { identification } = await User.findById(id).lean();
      return identification;
    }
    public static updateAvatar = async (id, avatar: string, session) => {
      return await User.findByIdAndUpdate( id, {avatar}, { new: true, runValidators: true, session})
    }
}