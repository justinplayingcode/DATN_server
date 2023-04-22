import mongoose, { Schema } from 'mongoose';
import { collectionName } from '../Data/schema';

const testSchema = new Schema({
    description: {
        type: String,
        trim: true,
        required: [true, 'description must be required']
    }
})

const Test = mongoose.model(collectionName.Test, testSchema);

export default Test