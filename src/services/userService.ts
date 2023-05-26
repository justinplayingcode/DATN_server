import { ClientSession } from "mongoose";
import { IEditUser, IUser } from "../models/Data/objModel";
import User from "../models/Schema/User";
import { schemaFields } from "../models/Data/schema";

export default class UserService {
    public static createUser = async (obj: IUser, session: ClientSession) => {
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
      const { email, ...other } = obj;
      let updateObj: any = obj;
      const oldEmail = await this.findEmailById(id);
      if(email === oldEmail) {
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
}