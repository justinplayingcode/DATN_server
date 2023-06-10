import { ClientSession } from "mongoose";
import AppointmentSchedule from "../schema/AppointmentSchedule";
import { DepartmentType, TypeAppointmentSchedule, statusAppointment } from "../utils/enum";
import { ICreateAppointmentSchedule, ICreateAppointmentScheduleWhenRegister } from "../models/AppointmentSchedule";
import { TableResponseNoData, schemaFields } from "../utils/constant";
import MomentTimezone from "../helpers/timezone";
import DoctorService from "./doctorService";

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

  public static findOneWithId = async (id) => {
    return await AppointmentSchedule.findById(id).lean()
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

  public static createWithRequestMedical = async (patientId, doctorId, departmentId, appointmentDate: Date, initialSymptom: string, session: ClientSession) => {
    try {
      const obj: ICreateAppointmentSchedule = {
        doctorId,
        patientId,
        appointmentDate,
        approve: false,
        typeAppointment: TypeAppointmentSchedule.khamTheoYeuCau,
        initialSymptom,
        statusAppointment: statusAppointment.wait,
        departmentId
      };
      return await AppointmentSchedule.create([obj], {session} );
    } catch (error) {
      throw error
    }
  }

  // cần viết thêm logic trả ra các kết quả xét nghiệm
  public static getSchedulesNormal = async (page: number, pageSize: number, searchKey: string, userId) => {
    const { departmentId } = await DoctorService.findDepartmentOfDoctor(userId) as any;
    if(departmentId.departmentCode === DepartmentType.canLamSang) {
      return TableResponseNoData;
    } else {
      const department = departmentId.departmentCode === DepartmentType.tiepDon ? undefined : departmentId.departmentCode;
      const values = (await AppointmentSchedule
        .find(department ? { doctorId: { $exists: false }, departmentId: departmentId._id, statusAppointment: statusAppointment.wait } : { doctorId: { $exists: false }, statusAppointment: statusAppointment.wait }, { __v: 0 })
        .sort({ statusUpdateTime: 1 })
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
        }, []) 
  
        const total = (await AppointmentSchedule
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
            if (userId) {
              acc.push(cur);
            }
            return acc;
          }, [])
        
      return {
        values,
        total: total.length,
      }
    }
  }

  public static getSchedulesParaclinical = async (page: number, pageSize: number, searchKey: string, userId) => {
    const { departmentId } = await DoctorService.findDepartmentOfDoctor(userId) as any;
    if(departmentId.departmentCode === DepartmentType.tiepDon) {
      return TableResponseNoData;
    } else {
      const department = departmentId.departmentCode === DepartmentType.canLamSang ? undefined : departmentId.departmentCode;
      const values = (await AppointmentSchedule
        .find(department ? { departmentId: departmentId._id, statusAppointment: statusAppointment.testing } : { statusAppointment: statusAppointment.testing }, { __v: 0 })
        .sort({ statusUpdateTime: 1 })
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
        }, []) 
  
        const total = (await AppointmentSchedule
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
            if (userId) {
              acc.push(cur);
            }
            return acc;
          }, [])
        
      return {
        values,
        total: total.length,
      }
    }
  }

  public static changeStatusToProcess = async (id, doctorId, session) => {
    try {
      const obj = {
        doctorId,
        statusAppointment: statusAppointment.process,
        statusUpdateTime: new Date
      }
      const value = await AppointmentSchedule
        .findByIdAndUpdate(id, obj, {runValidators: true, session})
        .populate({
          path: schemaFields.patientId,
          select: `-__v`,
          populate: {
            path: schemaFields.userId,
            select: `${schemaFields.fullname} ${schemaFields.email} ${schemaFields.phonenumber} ${schemaFields.address} ${schemaFields.dateOfBirth} ${schemaFields.gender} ${schemaFields._id} ${schemaFields.identification}`
          }
        })
        .populate({
          path: schemaFields.departmentId,
          select: `${schemaFields.departmentName} -${schemaFields._id}`
        })
        .select(`-__v -${schemaFields.approve} -${schemaFields.statusUpdateTime}`)
        .lean()

        let result;
        const { patientId, departmentId, appointmentDate, ...other } = value;
        const { departmentName } = departmentId as any;
        const { _id, userId, insurance } = patientId as any;
        if (userId) {
          const { _id: userid, dateOfBirth, ...infoUser } = userId as any;
          result = {
            ...other,
            appointmentDate: MomentTimezone.convertDDMMYYY(appointmentDate),
            userId: userid,
            ...infoUser,
            dateOfBirth: MomentTimezone.convertDDMMYYY(dateOfBirth),
            patientId: _id,
            insurance,
            departmentName
          };
        }


      return result; 
    } catch (error) {
      throw error;
    }
  }

  public static changeStatusToProcessAfterTesting = async (doctorId, ) => {
    
  }

  public static changeStatusToTesting = async (doctorId, ) => {
    
  }

  public static getAllScheduleRequest = async (page: number, pageSize: number, searchKey: string, doctorId, approve: boolean) => {

  }

  public static approveScheduleRequest = async (id) => {
    return await AppointmentSchedule.findByIdAndUpdate(id, { approve: true }, { new: true, runValidators: true})
  }
}