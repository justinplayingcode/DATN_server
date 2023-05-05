import mongoose, { Schema } from 'mongoose';
import { collectionName } from '../Data/schema';

const bloodPressureSchema = new Schema({
    systolic: {
        type: Number,
        required: true
    },
    diastolic: {
        type: Number,
        required: true
    }
})

const healthSchema = new Schema({
    patient: {
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
    bloodPressure: {
        type: bloodPressureSchema,
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
    },
    medicalHistory: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: collectionName.Diseases
        }],
        default: []
    }
})

const Health = mongoose.model(collectionName.Health, healthSchema);

export default Health;