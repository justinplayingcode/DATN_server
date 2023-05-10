import mongoose, { Schema } from 'mongoose';
import { collectionName, statusAppointment } from '../Data/schema';
import Message from '../../utils/message';
import Validate from '../../utils/validate';
import Convert from '../../utils/convert';
import Histories from './Histories';
import Health from './Health';

const patientSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: collectionName.User,
        required: true
    },
    boarding: {
        type: Boolean,
        // khi moi dang ky => false, nhap vien => true
        required: [true, 'boarding must be required']
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
    status: {
        type: Number,
        enum: {
            values: Convert.enumToArray(statusAppointment),
            message: "{VALUE} is not supported"
        },
        required: true
    },
    department: {
        type: Schema.Types.ObjectId,
        ref: collectionName.Department,
        required: [true, 'speciality must be required'],
    },
    hospitalization: {
        type: Number,
        required: true
    }
})

patientSchema.pre('remove', function(this: mongoose.Document ,next) {
    Histories.updateMany({patient: this._id},{$unset:{ patient: ''}}).exec();
    Health.updateMany({patient: this._id},{$unset:{ patient: ''}}).exec();
    next();
})

const Patient = mongoose.model(collectionName.Patient, patientSchema);

export default Patient;