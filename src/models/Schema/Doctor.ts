import mongoose, { Schema } from 'mongoose';
import { validateFullName, validatePhoneNumber } from "../../utils/validate";
import { invalidPhoneNumber, invalidFullname } from '../../utils/message';
import { DepartmentType, Gender, collectionName } from '../Data/schema';
import { convertEnumToArray } from '../../utils/convert';

const doctorSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fullname: {
        type: String,
        trim: true,
        required: [true, 'fullname must be required'],
        validate: {
            validator: value => validateFullName(value),
            message: props => invalidFullname(props.value)
        },
    },
    phonenumber: {
        type: String,
        trim: true,
        unique: true,
        required: [true, 'phonenumber must be required'],
        validate: {
            validator: value => validatePhoneNumber(value),
            message: props => invalidPhoneNumber(props.value)
        },
    },
    gender: {
        type: Number,
        required: [true, 'gender must be required'],
        enum: {
            values: convertEnumToArray(Gender),
            message: "{VALUE} is not supported in gender"
        }
    },
    speciality: {
        type: Number,
        required: [true, 'speciality must be required'],
        enum: {
            values: convertEnumToArray(DepartmentType),
            message: "{VALUE} is not supported"
        }
    }
})

const Doctor = mongoose.model(collectionName.Doctor, doctorSchema);

export default Doctor;