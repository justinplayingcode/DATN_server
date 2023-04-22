import mongoose, { Schema } from 'mongoose';
import { collectionName } from '../Data/schema';

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
    departmentId: {
        type: Schema.Types.ObjectId,
        ref: collectionName.Department,
        required: true
    }
})

const Diseases = mongoose.model(collectionName.Diseases, diseasesSchema);

export default Diseases;