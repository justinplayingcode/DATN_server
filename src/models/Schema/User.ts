import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import Validate from '../../utils/validate';
import Message from '../../utils/message';
import { findOneUser } from '../../services/authService';
import { Role, collectionName } from '../Data/schema';
import Convert from '../../utils/convert';

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
                    const user = await findOneUser('email', value);
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
    }
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

const User = mongoose.model(collectionName.User, userSchema);

export default User;