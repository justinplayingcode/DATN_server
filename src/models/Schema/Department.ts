import mongoose, { Schema } from 'mongoose';
import { DepartmentType, collectionName } from '../Data/schema';
import Convert from '../../utils/convert';
import Doctor from './Doctor';
import Patient from './Patient';
import Post from './Post';
import Diseases from './Diseases';

const departmentSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    code: {
        type: String,
        required: true,
        enum: {
            values: Convert.enumToArray(DepartmentType),
            message: "{VALUE} is not supported"
        }
    }
})

departmentSchema.pre('remove', function(this: mongoose.Document ,next) {
    Doctor.updateMany({department: this._id},{$unset:{ department: ''}}).exec();
    Patient.updateMany({department: this._id},{$unset:{ department: ''}}).exec();
    Post.updateMany({department: this._id},{$unset:{ department: ''}}).exec();
    Diseases.updateMany({department: this._id},{$unset:{ department: ''}}).exec();
    next()
})

const Department = mongoose.model(collectionName.Department, departmentSchema)

export default Department;