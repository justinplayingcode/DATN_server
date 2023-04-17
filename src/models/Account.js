import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { validateUserName, validateEmail } from '../utils/validate';
import { invalidUserName, invalidEmail } from '../utils/message';

const accountSchema = new Schema({
    username: {
        type: String, 
        unique: true, 
        trim: true,
        validate: {
            validator: value => validateUserName(value),
            message: props => invalidUserName(props.value)
        },
        required: [true, 'username must be required']
    },
    email: {
        type: String, 
        unique: true, 
        trim: true,
        validate: {
            validator: value => {
                if(!value) return true;
                validateEmail(value);
            },
            message: props => invalidEmail(props.value)
        },
    },
    password: {
        type: String, 
        trim: true, 
        required: [true, 'password must be required'], 
        minlength: [6, 'password must be at least 6 characters']
    },
    role: {
        type: String,
        trim: true, 
        required: [true, 'role must be required'],
        enum: {
            values: ['admin', 'doctor', 'patient'],
            message: "{VALUE} is not supported, just only 'admin', 'doctor' or 'patient' plz!"
        }
    }
}, {timestamps: true});

accountSchema.pre('save', function(next) {
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

const Account = mongoose.model('User', accountSchema);

export default Account;