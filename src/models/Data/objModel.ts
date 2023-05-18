import { Schema } from "mongoose";
import { Gender, Role } from "./schema";


export interface ICreateUser {
    username: string,
    email: string,
    password: string,
    role: Role,
    fullname: string,
    phonenumber: string,
    gender: Gender,
    dateOfBirth: Date,
    address: string,
    identification: string,
}

export interface ICreateDoctor {
    userId: Schema.Types.ObjectId,
    department: Schema.Types.ObjectId,
    rank: Number,
    position: Number
}

export interface ICreatePatient {
    userId: Schema.Types.ObjectId,
    boarding: Boolean,
    insurance: string,
    status: Number,
    department: Schema.Types.ObjectId,
    hospitalization: Number
}

export interface ILogin {
    username: string,
    password: string
}

export interface IValidateReqBody {
    pass: boolean,
    message? : string
}

export interface ICreateDepartment {
    name: string,
    code: string
}

export interface ICreateHealth {
    patient: Schema.Types.ObjectId,
    heartRate: Number,
    temperature: Number,
    bloodPressure: {
        systolic: Number,
        diastolic: Number
    },
    glucose: Number,
    weight: Number,
    height: Number,
    medicalHistory: Schema.Types.ObjectId[]
}

export interface ICreateMedication {
  name: string,
  designation: string,
  usage: string,
  price: number
}