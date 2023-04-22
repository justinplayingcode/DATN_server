import { Schema } from "mongoose";
import { Role } from "./schema";

export interface ICreateAdmin {
    username: string,
    email: string,
    password: string,
    role: Role,
    avatar: string
}

export interface ICreateSecurity {
    userId: Schema.Types.ObjectId,
    refreshToken: string
}

export interface ILogin {
    username: string,
    password: string
}

export interface IValidateReqBody {
    pass: boolean,
    message? : string
}
