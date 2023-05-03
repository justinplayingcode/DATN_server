import { ICreateUser } from "../models/Data/objModel";
import User from "../models/Schema/User";

export default class UserService {
    public static createUser = async (obj: ICreateUser) => {
        return await User.create(obj);
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