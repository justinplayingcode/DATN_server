import { Schema } from "mongoose";

export interface ICreateHistory {
  appointmentScheduleId: Schema.Types.ObjectId;
  hospitalizationCount: Number;
}