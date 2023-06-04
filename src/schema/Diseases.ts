import mongoose, { Schema } from 'mongoose';
import Histories from './Histories';
import Health from './Health';
import { collectionName } from '../utils/constant';

const diseasesSchema = new Schema({
    name: {
        type: String,
        trim: true,
        uppercase: true,
        required: true,
        unique: true
    },
    symptom: {
        type: String,
        trim: true,
        required: true
    },
    prevention: {
      type: String,
      trim: true,
      required: true
  },
    departmentId: {
        type: Schema.Types.ObjectId,
        ref: collectionName.Department,
        required: true
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true
    }
})

diseasesSchema.pre('remove', function(this: mongoose.Document ,next) {
    Histories.updateMany({diagnosis: this._id},{$unset:{ diagnosis: ''}}).exec();
    Health.updateMany({medicalHistory: { $in: [this._id]}},{ $pull: { medicalHistory: this._id}}).exec();
    next();
})

const Diseases = mongoose.model(collectionName.Diseases, diseasesSchema);

export default Diseases;