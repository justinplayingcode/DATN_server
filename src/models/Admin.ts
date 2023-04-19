import mongoose, { Schema } from 'mongoose';
import { validateFullName, validatePhoneNumber } from "../utils/validate";
import { invalidPhoneNumber, invalidFullname } from '../utils/message';

const adminSchema = new Schema({
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
        validate: {
            validator: value => {
                if(!value) return true;
                validatePhoneNumber(value);
            },
            message: props => invalidPhoneNumber(props.value)
        },
    },
    gender: {
        type: String,
        trim: true,
        required: [true, 'gender must be required'],
        enum: {
            values: ['male','female'],
            message: "{VALUE} is not supported, just only 'male' or 'female' plz!"
        }
    }
})

const Admin = mongoose.model('Admin', adminSchema)

export default Admin;