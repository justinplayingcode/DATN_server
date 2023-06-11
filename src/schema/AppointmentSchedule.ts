import mongoose, { Schema } from 'mongoose';
import { TypeAppointmentSchedule, StatusAppointment } from '../utils/enum';
import Convert from '../utils/convert';
import { collectionName } from '../utils/constant';

const appointmentScheduleSchema = new Schema({
  doctorId: {
    type: Schema.Types.ObjectId,
    ref: collectionName.Doctor,
  },
  patientId: {
    type: Schema.Types.ObjectId,
    ref: collectionName.Patient,
    required: [true, 'patientId must be required']
  },
  departmentId: {
    type: Schema.Types.ObjectId,
    ref: collectionName.Department,
    required: [true, 'departmentId must be required']
  },
  appointmentDate: {
    type: Date,
    required: [true, 'appointmentDate must be required']
  },
  approve: {
    type: Boolean,
    required: [true, 'approve must be required']
  },
  typeAppointment: {
    type: Number,
    required: [true, 'type of appointmentSchedule must be required'],
    enum: {
      values: Convert.enumToArray(TypeAppointmentSchedule),
      message: "{VALUE} is not supported in type of typeAppointment"
    }
  },
  initialSymptom: {
    type: String,
    trim: true
  },
  statusAppointment: {
    type: Number,
    required: [true, 'type of statusAppointment must be required'],
    enum: {
      values: Convert.enumToArray(StatusAppointment),
      message: "{VALUE} is not supported in type of statusAppointment"
    }
  },
  statusUpdateTime: {
    type: Date,
    required: true,
    default: new Date
  }
})

// appointmentScheduleSchema.pre('remove', function(this: mongoose.Document ,next) {
//   Histories.updateMany({appointmentScheduleId: this._id},{$unset:{ appointmentScheduleId: ''}}).exec();
//   next();
// })

const AppointmentSchedule = mongoose.model(collectionName.AppointmentSchedule, appointmentScheduleSchema);

export default AppointmentSchedule;
