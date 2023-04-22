import mongoose, { Schema } from 'mongoose';
import Validate from "../../utils/validate";
import Message from '../../utils/message';
import { Gender, collectionName } from '../Data/schema';
import Convert from '../../utils/convert';

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
            validator: value => Validate.fullName(value),
            message: props => Message.invalidFullname(props.value)
        },
    },
    phonenumber: {
        type: String,
        trim: true,
        unique: true,
        required: [true, 'phonenumber must be required'],
        validate: {
            validator: value => Validate.phoneNumber(value),
            message: props => Message.invalidPhoneNumber(props.value)
        },
    },
    gender: {
        type: Number,
        required: [true, 'gender must be required'],
        enum: {
            values: Convert.enumToArray(Gender),
            message: "{VALUE} is not supported in gender"
        }
    }
})

const Admin = mongoose.model(collectionName.Admin, adminSchema)

export default Admin;