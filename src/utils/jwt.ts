import  jwt from "jsonwebtoken";

export default class jwToken {
    public static createAccessToken = (obj) => {
        return jwt.sign(obj, process.env.APP_SECRET)
    }
}

