import { Schema } from "mongoose";
import { Onboarding } from "../utils/enum";

export interface ICreatePatient {
  userId: Schema.Types.ObjectId,
  insurance: string,
  hospitalization: Number
}

export interface ICreateBoarding {
  patientId: Schema.Types.ObjectId,
  departmentId: Schema.Types.ObjectId,
  boardingStatus: Onboarding,
  onboardingDate: Date
}

export interface IEditBoarding {
  departmentId: Schema.Types.ObjectId,
  boardingStatus: Onboarding,
  onboardingDate: Date
}