import mongoose, { Schema } from "mongoose";
import { collectionName } from "../utils/constant";

const billSchema = new Schema({
  historyId: {
    type: Schema.Types.ObjectId,
    ref: collectionName.Histories,
    required: [true, 'historyId must be required']
  },
  detail: {
    type: String,
    required: [true, 'detail must be required']
  },
  totalCost: {
    type: Number,
    required: [true, 'totalCost must be required']
  }
}, {timestamps: true})

const Bill = mongoose.model(collectionName.Bill, billSchema);
export default Bill;