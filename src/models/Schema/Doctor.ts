import mongoose, { Schema } from 'mongoose';
import { DoctorRank, Position, collectionName } from '../Data/schema';
import Post from './Post';
import Histories from './Histories';
import Convert from '../../utils/convert';

const doctorSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: collectionName.User,
        required: [true, 'userId must be required'],
    },
    department: {
        type: Schema.Types.ObjectId,
        required: [true, 'speciality must be required'],
        ref: collectionName.Department
    },
    rank: {
        type: Number,
        required: [true, 'rank must be required'],
        enum: {
            values: Convert.enumToArray(DoctorRank),
            message: "{VALUE} is not supported in gender"
        }
    },
    position: {
        type: Number,
        required: [true, 'position must be required'],
        enum: {
            values: Convert.enumToArray(Position),
            message: "{VALUE} is not supported in gender"
        }
    }
})

doctorSchema.pre('remove', function(this: mongoose.Document ,next) {
    Histories.updateMany({doctor: this._id},{$unset:{ doctor: ''}}).exec();
    Post.updateMany({author: this._id},{$unset:{ author: ''}}).exec();
    next();
})

const Doctor = mongoose.model(collectionName.Doctor, doctorSchema);

export default Doctor;