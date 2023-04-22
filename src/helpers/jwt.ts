import  jwt from "jsonwebtoken";

export default class jwToken {
    public static createAccessToken = (payload) => {
        return jwt.sign(payload, process.env.APP_SECRET, {
            algorithm: "HS256",
            expiresIn: "10m",
        })
    }
    public static createRefreshToken = (payload) => {
        return jwt.sign(payload, process.env.APP_REFRESH, {
            algorithm: "RS256",
            expiresIn: "7d",
        })
    }
    public static getPayloadInRefreshToken = (token) => {
        const payload  = jwt.verify(token, process.env.APP_REFRESH);
        if (typeof payload === 'string') {
            return payload;
        }
        return payload.username;
    }
}

