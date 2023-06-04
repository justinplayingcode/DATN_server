import mongoose, { Schema } from 'mongoose';
import { collectionName } from '../utils/constant';

const healthSchema = new Schema({
    patientId: {
        type: Schema.Types.ObjectId,
        ref: collectionName.Patient,
        required: true
    },
    heartRate: {
        type: Number,
        required: true
    },
    temperature: {
        type: Number,
        required: true
    },
    bloodPressureSystolic: {
        type: Number,
        required: true
    },
    bloodPressureDiastolic: {
      type: Number,
      required: true
  },
    glucose: {
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    height: {
        type: Number,
        required: true
    }
})

const Health = mongoose.model(collectionName.Health, healthSchema);

export default Health;