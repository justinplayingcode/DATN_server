import { Schema } from "mongoose";

export interface ICreateDoctor {
  userId: Schema.Types.ObjectId,
  departmentId: Schema.Types.ObjectId,
  rank: Number,
  position: Number
}