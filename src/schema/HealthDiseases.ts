import mongoose, { Schema } from "mongoose";
import { collectionName } from "../utils/constant";

const healthDiseasesSchema = new Schema({
  healthId: {
    type: Schema.Types.ObjectId,
    ref: collectionName.Health,
    required: true
  },
  diseaseId: {
    type: Schema.Types.ObjectId,
    ref: collectionName.Diseases,
    required: true
  }
})

const HealthDiseases = mongoose.model(collectionName.HealthDiseases, healthDiseasesSchema);

export default HealthDiseases;