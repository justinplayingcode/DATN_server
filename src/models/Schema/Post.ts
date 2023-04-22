import mongoose, { Schema } from 'mongoose';
import { collectionName } from '../Data/schema';

const postSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: collectionName.Doctor,
        required: [true, 'author must be required']
    },
    title: {
        type: String,
        trim: true,
        required: [true, 'title must be required']
    },
    content: {
        type: String,
        trim: true,
        required: [true, 'content must be required']
    },
    departmentId: {
        type: Schema.Types.ObjectId,
        ref: collectionName.Department,
        required: [true, 'departmentId must be required']
    },
    image: {
        type: String,
        trim: true,
    },
    template: {
        type: Number,
        required: [true, 'template must be required']
    }
})

const Post = mongoose.model(collectionName.Post, postSchema);

export default Post