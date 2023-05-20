import { ClientSession } from "mongoose";
import { IEditUser, IUser } from "../models/Data/objModel";
import User from "../models/Schema/User";
import { schemaFields } from "../models/Data/schema";

export default class UserService {
    public static createUser = async (obj: IUser, session) => {
      try {
        const user = new User(obj);
        return user.save({ session });
      } catch (error) {
        throw error;
      }
    }
    public static findOneUser = async (key, obj) => {
        return await User.findOne({ [key]: obj});
    }
    public static getAllUserName = async () => {
        const arr = await User.find({});
        const usernames = [];
        arr.forEach((e) => {
            usernames.push(e.username)
        })
        return usernames
    }
    public static editOne = async (id, obj: IEditUser, session: ClientSession) => {
      return await User.findByIdAndUpdate( id, obj, { new: true, runValidators: true, session, select: `-__v -${schemaFields.username} -${schemaFields.password} -${schemaFields._id} -${schemaFields.role}`})
    }
}