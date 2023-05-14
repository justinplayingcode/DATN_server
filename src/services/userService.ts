import { ICreateUser } from "../models/Data/objModel";
import User from "../models/Schema/User";

export default class UserService {
    public static createUser = async (obj: ICreateUser, session) => {
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
}