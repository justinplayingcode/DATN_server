import { Schema } from "mongoose";

export interface ICreateBill {
  historyId: Schema.Types.ObjectId,
  detail: String;
  totalCost: Number;
}