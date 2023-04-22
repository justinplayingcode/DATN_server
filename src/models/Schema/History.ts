import mongoose, { Schema } from 'mongoose';
import { collectionName } from '../Data/schema';

const historySchema = new Schema({
    doctorId: {
        type: Schema.Types.ObjectId,
        ref: collectionName.Doctor,
        required: [true, 'doctorId must be required']
    },
    patientId: {
        type: Schema.Types.ObjectId,
        ref: collectionName.Patient,
        required: [true, 'patientId must be required']
    },
    diagnosis: {
        type: Schema.Types.ObjectId,
        ref: collectionName.Diseases,
        required: [true, 'diagnosis must be required']
    },
    hospitalizationCount: {
        type: Number,
        rrequired: [true, 'hospitalizationCount must be required']
    },
    prescription: [{
        type: Schema.Types.ObjectId,
        ref: collectionName.Medications
    }],
    testsId: [{
        type: Schema.Types.ObjectId,
        ref: collectionName.Test
    }]
}, { timestamps: true })

const History = mongoose.model(collectionName.History, historySchema);

export default History