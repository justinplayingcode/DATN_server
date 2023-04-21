import mongoose, { Schema } from 'mongoose';
import { validateFullName, validatePhoneNumber } from "../../utils/validate";
import { invalidPhoneNumber, invalidFullname } from '../../utils/message';
import { Gender, collectionName } from '../Data/schema';
import { convertEnumToArray } from '../../utils/convert';

const adminSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: collectionName.User,
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
        trim: true,
        required: [true, 'gender must be required'],
        enum: {
            values: convertEnumToArray(Gender),
            message: "{VALUE} is not supported in gender"
        }
    }
})

const Admin = mongoose.model(collectionName.Admin, adminSchema)

export default Admin;