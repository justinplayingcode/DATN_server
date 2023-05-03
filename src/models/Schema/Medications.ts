import mongoose, { Schema } from 'mongoose';
import { collectionName } from '../Data/schema';
import Histories from './Histories';

const medicationsSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    indications: {
        type: String,
        trim: true,
        required: true
    },
    usage: {
        type: String,
        trim: true,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
})

medicationsSchema.pre('remove', function(this: mongoose.Document ,next) {
    Histories.updateMany({prescription: { $in: [this._id]}},{ $pull: { prescription: this._id}}).exec();
    next();
})

const Medications = mongoose.model(collectionName.Medications, medicationsSchema);

export default Medications;