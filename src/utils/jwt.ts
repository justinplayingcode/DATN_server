import  jwt from "jsonwebtoken";

export const createAccessToken = (obj) => {
    return jwt.sign(obj, process.env.APP_SECRET)
}

