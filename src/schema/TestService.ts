import mongoose, { Schema } from "mongoose";
import Convert from "../utils/convert";
import { TypeTestService } from "../utils/enum";
import { collectionName } from "../utils/constant";

const testServiceSchema = new Schema({
  service: {
    type: Number,
    enum: {
      values: Convert.enumToArray(TypeTestService),
      message: "{VALUE} is not supported in type of typeAppointment"
    },
    required: true
  },
  price: {
    type: Number,
    required: true
  }
})

const TestService = mongoose.model(collectionName.TestService, testServiceSchema);

export default TestService;