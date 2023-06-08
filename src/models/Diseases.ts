import { Schema } from "mongoose";

export interface ICreateDiseases {
  diseasesCode: string,
  diseasesName: string,
  symptom: string,
  prevention: string,
  departmentId: Schema.Types.ObjectId
}
