import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import Validate from '../utils/validate';
import Message from '../utils/message';
import Convert from '../utils/convert';
import { Role } from '../utils/enum';
import { collectionName } from '../utils/constant';

const securitySchema = new Schema({
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
    userId: {
        type: Schema.Types.ObjectId,
        ref: collectionName.User,
        required: true
    },
    refreshToken: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
})

securitySchema.pre('save', function(next) {
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

const Security = mongoose.model(collectionName.Security, securitySchema);

export default Security