import mongoose, { Schema } from 'mongoose';
import { collectionName } from '../Data/schema';
import Post from './Post';
import Histories from './Histories';

const doctorSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: collectionName.User,
        required: true
    },
    department: {
        type: Schema.Types.ObjectId,
        required: [true, 'speciality must be required'],
        ref: collectionName.Department
    }
})

doctorSchema.pre('remove', function(this: mongoose.Document ,next) {
    Histories.updateMany({doctor: this._id},{$unset:{ doctor: ''}}).exec();
    Post.updateMany({author: this._id},{$unset:{ author: ''}}).exec();
    next();
})

const Doctor = mongoose.model(collectionName.Doctor, doctorSchema);

export default Doctor;