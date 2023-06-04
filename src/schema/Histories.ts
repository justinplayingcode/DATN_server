import mongoose, { Schema } from 'mongoose';
import { collectionName } from '../utils/constant';

const historySchema = new Schema({
    appointmentScheduleId: {
        type: Schema.Types.ObjectId,
        ref: collectionName.AppointmentSchedule,
        required: [true, 'appointmentScheduleId must be required']
    },
    diagnosis: {
        type: Schema.Types.ObjectId,
        ref: collectionName.Diseases,
        required: [true, 'diagnosis must be required']
    },
    hospitalizationCount: {
        type: Number,
        required: [true, 'hospitalizationCount must be required']
        // lay data tu bang patient
    },
    summary: {
      type: String,
      trim: true
    }
})

const Histories = mongoose.model(collectionName.Histories, historySchema);

export default Histories