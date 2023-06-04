import { Schema } from "mongoose"

export interface ICreateHealth {
  patientId: Schema.Types.ObjectId,
  heartRate: Number,
  temperature: Number,
  bloodPressureSystolic: Number,
  bloodPressureDiastolic: Number
  glucose: Number,
  weight: Number,
  height: Number
}