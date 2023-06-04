import mongoose, { Schema } from 'mongoose';
import Convert from '../utils/convert';
import { collectionName } from '../utils/constant';
import { DoctorRank, Position } from '../utils/enum';

const doctorSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: collectionName.User,
        required: [true, 'userId must be required'],
    },
    departmentId: {
        type: Schema.Types.ObjectId,
        required: [true, 'department must be required'],
        ref: collectionName.Department
    },
    rank: {
        type: Number,
        required: [true, 'rank must be required'],
        enum: {
            values: Convert.enumToArray(DoctorRank),
            message: "{VALUE} is not supported in gender"
        }
    },
    position: {
        type: Number,
        required: [true, 'position must be required'],
        enum: {
            values: Convert.enumToArray(Position),
            message: "{VALUE} is not supported in gender"
        }
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true
    }
})

// doctorSchema.pre('remove', function(this: mongoose.Document ,next) {
//     AppointmentSchedule.updateMany({doctor: this._id},{$unset:{ doctor: ''}}).exec();
// })

const Doctor = mongoose.model(collectionName.Doctor, doctorSchema);

export default Doctor;