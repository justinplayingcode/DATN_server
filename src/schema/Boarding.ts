import mongoose, { Schema } from "mongoose";
import Convert from "../utils/convert";
import { collectionName } from "../utils/constant";
import { Onboarding } from "../utils/enum";

const boaringSchema = new Schema({
  patientId: {
    type: Schema.Types.ObjectId,
    ref: collectionName.Patient,
    required: true
  },
  departmentId: {
    type: Schema.Types.ObjectId,
    ref: collectionName.Department,
    required: true
  },
  boardingStatus: {
    type: Number,
    required: true,
    enum: {
      values: Convert.enumToArray(Onboarding),
      message: "{VALUE} is not supported"
    }
  },
  onBoardingDate: {
    type: Date,
    required: true,
    default: new Date
  }
})

const Boarding = mongoose.model(collectionName.Boarding, boaringSchema);

export default Boarding;