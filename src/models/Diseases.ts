import { Schema } from "mongoose";

export interface ICreateDiseases {
  name: string,
  symptom: string,
  prevention: string,
  departmentId: Schema.Types.ObjectId
}
