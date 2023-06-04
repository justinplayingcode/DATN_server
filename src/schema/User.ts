import mongoose, { Schema } from 'mongoose';
import Validate from '../utils/validate';
import Message from '../utils/message';
import UserService from '../services/userService';
import Convert from '../utils/convert';
// import Doctor from './Doctor';
// import Patient from './Patient';
// import Security from './Security';
import { collectionName, schemaFields } from '../utils/constant';
import { Gender } from '../utils/enum';

const userSchema = new Schema({
    email: {
        type: String,
        trim: true,
        lowercase: true,
        validate: [
            {
                validator: value => Validate.email(value),
                message: props => Message.invalidEmail(props.value)
            },
            {
                validator: async (value) => {
                    if (value === "") return true;
                    const user = await UserService.findOneUser(schemaFields.email, value);
                    return !user;
                },
                message: props => `${props.value}: email này đã tồn tại`
            }
        ]
    },
    avatar: {
        type: String,
        trim: true,
        default: 'https://res.cloudinary.com/dipiauw0v/image/upload/v1682100699/DATN/unisex_avatar.jpg?fbclid=IwAR0rfobILbtfTZlNoWFiWmHYPH7bPMKFP0ztGnT8CVEXtvgTOEPEBgYtxY8'
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
    },
    address: {
        type: String,
        trim: true,
    },
    dateOfBirth: {
        type: Date,
        required: [true, 'date Of Birth must be required']
    },
    identification: {
        type: String,
        trim: true,
        validate: [
            {
                validator: value => Validate.identification(value),
                message: props => Message.invalidIdentification(props.value)
            },
            {
                validator: async (value) => {
                  if (value === "") return true;
                  const user = await UserService.findOneUser(schemaFields.identification, value);
                  return !user;
                },
                message: props => `${props.value}: identification này đã tồn tại`
            }
        ]
    },
});

// userSchema.pre('remove', function(this: mongoose.Document ,next) {
//     Doctor.updateMany({userId: this._id},{$unset:{ userId: ''}}).exec();
//     Patient.updateMany({userId: this._id},{$unset:{ userId: ''}}).exec();
//     Security.updateMany({userId: this._id},{$unset:{ userId: ''}}).exec();
//     next();
// })

userSchema.pre('remove', function(next) {


})

const User = mongoose.model(collectionName.User, userSchema);

export default User;