import { Schema } from "mongoose";

export interface ICreatePatient {
  userId: Schema.Types.ObjectId,
  insurance: string,
  hospitalization: Number
}