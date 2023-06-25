import mongoose, { Schema } from "mongoose";
import { collectionName } from "../utils/constant";

const testResultSchema = new Schema({
  doctorId: {
    type: Schema.Types.ObjectId,
    ref: collectionName.Doctor,
  },
  detailsFileCloud: {
    type: String,
    trim: true,
  },
  reason: {
    type: String,
    trim: true
  },
  serviceId: {
    type: Schema.Types.ObjectId,
    ref: collectionName.TestService,
  },
  historyId: {
    type: Schema.Types.ObjectId,
    ref: collectionName.Histories,
  }
})

const TestResult = mongoose.model(collectionName.TestResult, testResultSchema);

export default TestResult;