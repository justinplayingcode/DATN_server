import { ClientSession } from "mongoose";
import AppointmentSchedule from "../schema/AppointmentSchedule";
import { TypeAppointmentSchedule, statusAppointment } from "../utils/enum";
import { ICreateAppointmentSchedule, ICreateAppointmentScheduleWhenRegister } from "../models/AppointmentSchedule";
import { schemaFields } from "../utils/constant";
import MomentTimezone from "../helpers/timezone";

export default class appointmentScheduleService {
  public static createWhenRegister = async (patientId, initialSymptom, typeAppointment, departmentId, session: ClientSession) => {
    try {
      const obj: ICreateAppointmentScheduleWhenRegister = {
        patientId,
        appointmentDate: new Date,
        approve: true,
        typeAppointment,
        initialSymptom,
        statusAppointment: statusAppointment.wait,
        departmentId
      };
      const appointmentSchedule = new AppointmentSchedule(obj);
      return appointmentSchedule.save({ session });
    } catch (error) {
      throw error
    }
  }

  public static createWhenRegisterPatientIn = async (patientId, doctorId, initialSymptom, departmentId, appointmentDate: Date, session: ClientSession) => {
    try {
      const obj: ICreateAppointmentSchedule = {
        doctorId,
        patientId,
        appointmentDate,
        approve: true,
        typeAppointment: TypeAppointmentSchedule.khamTheoChiDinh,
        initialSymptom,
        statusAppointment: statusAppointment.wait,
        departmentId
      };
      const appointmentSchedule = new AppointmentSchedule(obj);
      return appointmentSchedule.save({ session });
    } catch (error) {
      throw error
    }
  }

  public static createWithRequestMedical = async (patientId, doctorId, departmentId, session: ClientSession) => {
    try {
      const obj: ICreateAppointmentSchedule = {
        doctorId,
        patientId,
        appointmentDate: new Date,
        approve: false,
        typeAppointment: TypeAppointmentSchedule.khamTheoYeuCau,
        initialSymptom: "", //
        statusAppointment: statusAppointment.wait,
        departmentId
      };
      const appointmentSchedule = new AppointmentSchedule(obj);
      return appointmentSchedule.save({ session });
    } catch (error) {
      throw error
    }
  }

  public static getSchedulesNormalWithReception = async (page: number, pageSize: number, searchKey: string) => {
    const values = (await AppointmentSchedule
      .find({ doctorId: { $exists: false } }, { __v: 0 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate({
        path: schemaFields.patientId,
        select: `-__v`,
        populate: {
          path: schemaFields.userId,
          select: `${schemaFields.fullname} ${schemaFields.email} ${schemaFields.phonenumber} ${schemaFields.address} ${schemaFields.dateOfBirth} ${schemaFields.gender} ${schemaFields._id} ${schemaFields.identification}`,
          match: {
            fullname: { $regex: new RegExp(searchKey, 'i') }
          }
        }
      })
      .populate({
        path: schemaFields.departmentId,
        select: `${schemaFields.departmentName} -${schemaFields._id}`
      })
      .select(`-${schemaFields.statusUpdateTime} -${schemaFields.approve}`)
      .lean())?.reduce((acc, cur) => {
        const { patientId, departmentId, appointmentDate, ...other } = cur;
        if (departmentId && patientId) {
          const { departmentName } = departmentId as any;
          const { _id, userId, insurance } = patientId as any;
          if (userId) {
            const { _id: userid, dateOfBirth, ...infoUser } = userId as any;
            acc.push({
              ...other,
              appointmentDate: MomentTimezone.convertDDMMYYY(appointmentDate),
              userId: userid,
              ...infoUser,
              dateOfBirth: MomentTimezone.convertDDMMYYY(dateOfBirth),
              patientId: _id,
              insurance,
              departmentName
            });
          }
        }
        return acc;
      }, []) // sort by appointmentDate

      const total = await (await AppointmentSchedule
        .find({ doctorId: { $exists: false } }, { __v: 0 })
        .populate({
          path: schemaFields.patientId,
          select: `-__v`,
          populate: {
            path: schemaFields.userId,
            match: {
              fullname: { $regex: new RegExp(searchKey, 'i') }
            }
          }
        })
        .lean()).reduce((acc, cur) => {
          const { userId } = cur.patientId as any;
          if(userId) {
            acc.push(cur)
          }
          return acc;
        }, [])
      
    return {
      values,
      total: total.length
    }
  }
}