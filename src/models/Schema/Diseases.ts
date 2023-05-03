import mongoose, { Schema } from 'mongoose';
import { collectionName } from '../Data/schema';
import Histories from './Histories';
import Health from './Health';

const diseasesSchema = new Schema({
    code: {
        type: String,
        trim: true,
        uppercase: true,
        required: true
    },
    name: {
        type: String,
        trim: true,
        uppercase: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
    },
    department: {
        type: Schema.Types.ObjectId,
        ref: collectionName.Department,
        required: true
    }
})

diseasesSchema.pre('remove', function(this: mongoose.Document ,next) {
    Histories.updateMany({diagnosis: this._id},{$unset:{ diagnosis: ''}}).exec();
    Health.updateMany({medicalHistory: { $in: [this._id]}},{ $pull: { medicalHistory: this._id}}).exec();
    next();
})

const Diseases = mongoose.model(collectionName.Diseases, diseasesSchema);

export default Diseases;