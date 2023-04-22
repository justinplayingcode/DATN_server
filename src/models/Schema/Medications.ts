import mongoose, { Schema } from 'mongoose';
import { collectionName } from '../Data/schema';

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

const Medications = mongoose.model(collectionName.Medications, medicationsSchema);

export default Medications;