import { Schema } from "mongoose";
import { DoctorRank, Position } from "../utils/enum";

export interface ICreateDoctor {
  userId: Schema.Types.ObjectId,
  departmentId: Schema.Types.ObjectId,
  rank: Number,
  position: Number
}

export interface IChangeInfoByAdmin {
  rank: DoctorRank,
  position: Position,
  departmentId: Schema.Types.ObjectId
}