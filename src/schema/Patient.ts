import mongoose, { Schema } from 'mongoose';
import Message from '../utils/message';
import Validate from '../utils/validate';
import { collectionName } from '../utils/constant';

const patientSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: collectionName.User,
        required: true
    },
    insurance: {
        type: String,
        trim: true,
        uppercase: true,
        required: [true, 'insurance must be required'],
        validate: [
            {
                validator: value => Validate.insurance(value),
                message: props => Message.invalidInsurance(props.value)
            }
        ]
    },
    hospitalization: {
        type: Number,
        required: true,
        default: 1
    }
})

// patientSchema.pre('remove', function(this: mongoose.Document ,next) {
//     AppointmentSchedule.updateMany({patient: this._id},{$unset:{ patient: ''}}).exec();
//     Health.updateMany({patient: this._id},{$unset:{ patient: ''}}).exec();
//     next();
// })

const Patient = mongoose.model(collectionName.Patient, patientSchema);

export default Patient;