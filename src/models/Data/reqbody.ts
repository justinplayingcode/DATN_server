import { Role } from "./schema";

export interface ICreateAdmin {
    username: string,
    email: string,
    password: string,
    role: Role,
    avatar: string
}

export interface ILogin {
    username: string,
    password: string
}

