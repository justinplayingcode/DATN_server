import mongoose, { Schema } from 'mongoose';
import Convert from '../utils/convert';
import { collectionName } from '../utils/constant';
import { TemplateType } from '../utils/enum';

const postSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: collectionName.User,
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
    image: {
        type: String,
        trim: true,
    },
    approve: {
        type: Boolean,
        required: [true, 'approve must be required']
    },
    template: {
        type: Number,
        enum: {
          values: Convert.enumToArray(TemplateType),
          message: "{VALUE} is not supported in type of template"
        },
        required: [true, 'template must be required']
    }
})

const Post = mongoose.model(collectionName.Post, postSchema);

export default Post