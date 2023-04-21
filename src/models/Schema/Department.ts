import mongoose, { Schema } from 'mongoose';
import { DepartmentType, collectionName } from '../Data/schema';
import { convertEnumToArray } from '../../utils/convert';

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
            values: convertEnumToArray(DepartmentType),
            message: "{VALUE} is not supported"
        }
    }
})

const Department = mongoose.model(collectionName.Department, departmentSchema)

export default Department;