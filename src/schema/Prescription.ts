import mongoose, { Schema } from 'mongoose';
import { collectionName } from '../utils/constant';

const prescriptionSchema = new Schema({
  historyId: {
    type: Schema.Types.ObjectId,
    ref: collectionName.Histories,
    required: [true, 'hítoryId must be required']
  },
  medicationId: {
    type: Schema.Types.ObjectId,
    ref: collectionName.Medications,
    required: [true, 'medicationId must be required']
  },
  note: {
    type: String,
    trim: true
  }

})

const Prescription = mongoose.model(collectionName.Prescription, prescriptionSchema);

export default Prescription