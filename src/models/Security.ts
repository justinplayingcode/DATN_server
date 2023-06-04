import { Schema } from "mongoose";
import { Role } from "../utils/enum";

export interface IValidateReqBody {
  pass: boolean,
  message? : string
}

export interface ICreateSecurity {
  userId: Schema.Types.ObjectId,
  username: string,
  password: string,
  role: Role,
}