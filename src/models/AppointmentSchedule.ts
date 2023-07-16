import { Schema } from "mongoose";
import {  TypeAppointmentSchedule, StatusAppointment, ScheduleRequestStatus } from "../utils/enum";

export interface ICreateAppointmentSchedule {
  doctorId: Schema.Types.ObjectId | string,
  patientId: Schema.Types.ObjectId,
  departmentId: Schema.Types.ObjectId,
  appointmentDate: Date,
  approve: ScheduleRequestStatus,
  typeAppointment: TypeAppointmentSchedule,
  initialSymptom: String,
  statusAppointment: StatusAppointment
}

export interface ICreateAppointmentScheduleWhenRegister {
  patientId: Schema.Types.ObjectId,
  departmentId: Schema.Types.ObjectId,
  appointmentDate: Date,
  approve: ScheduleRequestStatus,
  typeAppointment: TypeAppointmentSchedule,
  initialSymptom: String,
  statusAppointment: StatusAppointment
}