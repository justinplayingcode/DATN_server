import mongoose, { Schema } from 'mongoose';
import { collectionName } from '../utils/constant';
import Convert from '../utils/convert';
import { DepartmentType } from '../utils/enum';

const departmentSchema = new Schema({
    departmentName: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    departmentCode: {
      type: Number,
      required: true,
      unique: true,
      enum: {
        values: Convert.enumToArray(DepartmentType),
        message: "{VALUE} is not supported"
      }
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true
    }
})

const Department = mongoose.model(collectionName.Department, departmentSchema)

export default Department;