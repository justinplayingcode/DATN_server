import mongoose, { Schema } from 'mongoose';
import { collectionName } from '../Data/schema';

const securitySchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: collectionName.User,
        required: true
    },
    refreshToken: {
        type: String,
        trim: true,
        required: true
    }
})

const Security = mongoose.model(collectionName.Security, securitySchema);

export default Security