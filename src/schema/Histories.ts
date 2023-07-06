import mongoose, { Schema } from 'mongoose';
import { collectionName } from '../utils/constant';

const healthIndicatorSchema = new Schema({
  heartRate: Number,
  temperature: Number,
  bloodPressureSystolic: Number,
  bloodPressureDiastolic: Number,
  glucose: Number,
  weight: Number,
  height: Number
})

const historySchema = new Schema({
    appointmentScheduleId: {
        type: Schema.Types.ObjectId,
        ref: collectionName.AppointmentSchedule,
        required: [true, 'appointmentScheduleId must be required']
    },
    diagnosis: {
      type: String,
      trim: true
        // đây sẽ lưu id của các bệnh mà bác sĩ chuẩn đoán
    },
    hospitalizationCount: {
        type: Number,
        required: [true, 'hospitalizationCount must be required']
    },
    summary: {
      type: String,
      trim: true
    },
    healthIndicator: {
      type: healthIndicatorSchema,
      default: {}
    }
})

const Histories = mongoose.model(collectionName.Histories, historySchema);

export default Histories