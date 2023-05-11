import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import Validate from '../../utils/validate';
import Message from '../../utils/message';
import UserService from '../../services/userService';
import { Gender, Role, collectionName } from '../Data/schema';
import Convert from '../../utils/convert';
import Doctor from './Doctor';
import Patient from './Patient';
import Security from './Security';

const userSchema = new Schema({
    username: {
        type: String, 
        unique: true,
        trim: true,
        validate: {
            validator: value => Validate.userName(value),
            message: props => Message.invalidUserName(props.value)
        },
        required: [true, 'username must be required']
    },
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
                    const user = await UserService.findOneUser('email', value);
                    return !user;
                },
                message: props => `${props.value}: email already exists`
            }
        ]
    },
    password: {
        type: String, 
        trim: true, 
        required: [true, 'password must be required'], 
        minlength: [6, 'password must be at least 6 characters']
    },
    role: {
        type: Number,
        trim: true, 
        required: [true, 'role must be required'],
        enum: {
            values: Convert.enumToArray(Role),
            message: "{VALUE} is not supported in role"
        }
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
        unique: true,
        validate: [
            {
                validator: value => Validate.identification(value),
                message: props => Message.invalidIdentification(props.value)
            }
        ]
    },
});

userSchema.pre('save', function(next) {
    let user = this;
    bcrypt.hash(user.password, 10, (error, hashPassword) => {
        if (error) {
            return next(error);
        } else {
            user.password = hashPassword;
            next();
        }
    })
});

userSchema.pre('remove', function(this: mongoose.Document ,next) {
    Doctor.updateMany({userId: this._id},{$unset:{ userId: ''}}).exec();
    Patient.updateMany({userId: this._id},{$unset:{ userId: ''}}).exec();
    Security.updateMany({userId: this._id},{$unset:{ userId: ''}}).exec();
    next();
})

const User = mongoose.model(collectionName.User, userSchema);

export default User;