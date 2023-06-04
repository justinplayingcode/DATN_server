import { Schema } from "mongoose";
import {  TypeAppointmentSchedule, statusAppointment } from "../utils/enum";

export interface ICreateAppointmentSchedule {
  doctorId: Schema.Types.ObjectId | string,
  patientId: Schema.Types.ObjectId,
  departmentId: Schema.Types.ObjectId,
  appointmentDate: Date,
  approve: Boolean,
  typeAppointment: TypeAppointmentSchedule,
  initialSymptom: String,
  statusAppointment: statusAppointment
}

export interface ICreateAppointmentScheduleWhenRegister {
  patientId: Schema.Types.ObjectId,
  departmentId: Schema.Types.ObjectId,
  appointmentDate: Date,
  approve: Boolean,
  typeAppointment: TypeAppointmentSchedule,
  initialSymptom: String,
  statusAppointment: statusAppointment
}