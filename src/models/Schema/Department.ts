import mongoose, { Schema } from 'mongoose';
import { DepartmentType, collectionName } from '../Data/schema';
import Convert from '../../utils/convert';

const departmentSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    code: {
        type: Number,
        required: true,
        enum: {
            values: Convert.enumToArray(DepartmentType),
            message: "{VALUE} is not supported"
        }
    }
})

const Department = mongoose.model(collectionName.Department, departmentSchema)

export default Department;