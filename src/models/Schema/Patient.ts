import mongoose, { Schema } from 'mongoose';
import { Gender, collectionName, statusAppointment } from '../Data/schema';
import Message from '../../utils/message';
import Validate from '../../utils/validate';
import Convert from '../../utils/convert';

const patientSchema = new Schema({
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
        trim: true,
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
    },
    boarding: {
        type: Boolean,
        // khi moi dang ky => false, nhap vien => true
        required: [true, 'boarding must be required']
    },
    identification: {
        type: String,
        trim: true,
        validate: [
            {
                validator: value => Validate.identification(value),
                message: props => Message.invalidIdentification(props.value)
            }
        ]
    },
    insurance: {
        type: String,
        trim: true,
        uppercase: true,
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
        }
    },
    department: {
        type: Schema.Types.ObjectId,
        ref: collectionName.Department,
        required: true
    },
    hospitalization: {
        type: Number
    }
})

const Patient = mongoose.model(collectionName.Patient, patientSchema);

export default Patient;