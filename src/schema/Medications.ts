import mongoose, { Schema } from 'mongoose';
import { collectionName } from '../utils/constant';

const medicationsSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    designation: {
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
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true
    }
})

// medicationsSchema.pre('remove', function(this: mongoose.Document ,next) {
//     Histories.updateMany({prescription: { $in: [this._id]}},{ $pull: { prescription: this._id}}).exec();
//     next();
// })

const Medications = mongoose.model(collectionName.Medications, medicationsSchema);

export default Medications;