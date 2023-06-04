import { Gender } from "../utils/enum";

export interface IUser {
  email: string,
  avatar: string,
  fullname: string,
  phonenumber: string,
  gender: Gender,
  dateOfBirth: Date,
  address: string,
  identification: string,
}

export interface ICreateUser {
  email: string,
  fullname: string,
  phonenumber: string,
  gender: Gender,
  dateOfBirth: Date,
  address: string,
  identification: string,
}

export interface IEditUser {
  email: string,
  fullname: string,
  phonenumber: string,
  gender: Gender,
  dateOfBirth: Date,
  address: string,
  identification: string,
}