import MomentTimezone from "../helpers/timezone";
import { ICreateHistory } from "../models/Histories";
import AppointmentSchedule from "../schema/AppointmentSchedule";
import Histories from "../schema/Histories"
import { schemaFields } from "../utils/constant";
import { ScheduleRequestStatus, StatusAppointment } from "../utils/enum";
import DiseasesService from "./diseasesService";
import MedicationService from "./medicationService";
import prescriptionService from "./prescriptionService";
import testService from "./testService";

export default class historiesService {

  public static createNew = async (appointmentScheduleId, hospitalizationCount, session) => {
    try {
      const obj: ICreateHistory = {
        appointmentScheduleId,
        hospitalizationCount
      }
      const history = new Histories(obj);
      return await history.save({ session });
    } catch (error) {
      throw error
    }
  }

  public static findOneByKey = async (key: string, value) => {
    return await Histories.findOne({ [key]: value })
      .select(`-__v`)
      .lean();
  }

  public static updateHistory = async (id, obj, session) => {
    try {
      return await Histories.findByIdAndUpdate( id, obj, { new: true, runValidators: true, session })
    } catch (error) {
      throw error
    }
  }

  public static getHistoryMedicalOfPatient = async (page: number, pageSize: number, searchKey: string, patientId) => {
    // viet sau
    const values = (await AppointmentSchedule.find({patientId, statusAppointment: StatusAppointment.done, approve: ScheduleRequestStatus.accpect })
      .sort({ statusUpdateTime: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .select(`-__v -${schemaFields.statusUpdateTime} -${schemaFields.approve}`)
      .populate({
        path: schemaFields.doctorId,
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
      }).lean())?.reduce((acc, cur) => {
        const { doctorId: doctor, departmentId: department, appointmentDate, ...other } = cur;
        if(cur.doctorId) {
          const { _id: doctorId, userId: user, rank, position } = doctor as any;
          if(user) {
            const { _id: userId, dateOfBirth, ...info  } = user as any;
            const { _id: departmentId, departmentName } = department as any;
      
            acc.push({
              appointmentDate: MomentTimezone.convertDDMMYYY(appointmentDate),
              ...other,
              departmentId,
              departmentName,
              rank,
              position,
              doctorId,
              userId,
              dateOfBirth: MomentTimezone.convertDDMMYYY(dateOfBirth),
              ...info
            })
          }
        }
        return acc;
      }, [])

      const total = (await AppointmentSchedule.find({patientId, statusAppointment: StatusAppointment.done, approve: ScheduleRequestStatus.accpect })
        .populate({
          path: schemaFields.doctorId,
          populate: {
            path: schemaFields.userId,
            match: {
              fullname: { $regex: new RegExp(searchKey, 'i') }
            }
          }
        }).lean()).reduce((acc, cur) => {
          if(cur.doctorId) {
            const { userId: user } = cur.doctorId as any;
            if(user) {
              acc.push(cur)
            }
          }
          return acc;
        }, [])
    
    return {
      values,
      total: total.length
    }
  }

  public static getHistoryMedicalOfDoctor = async (page: number, pageSize: number, searchKey: string, doctorId) => {
    const values = (await AppointmentSchedule.find({ doctorId, statusAppointment: StatusAppointment.done, approve: ScheduleRequestStatus.accpect })
    .sort({ statusUpdateTime: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .select(`-__v -${schemaFields.statusUpdateTime} -${schemaFields.approve}`)
    .populate({
      path: schemaFields.patientId,
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
    })
    .lean())?.reduce((acc, cur) => {
      const { patientId: patient, departmentId: department, appointmentDate, ...other } = cur;
      if(cur.patientId) {
        const { _id: patientId, userId: user, insurance } = patient as any;
        if(user) {
          const { _id: userId, dateOfBirth, ...info  } = user as any;
          const { _id: departmentId, departmentName } = department as any;
          acc.push({
            appointmentDate: MomentTimezone.convertDDMMYYY(appointmentDate),
            ...other,
            departmentId,
            departmentName,
            insurance,
            patientId,
            userId,
            dateOfBirth: MomentTimezone.convertDDMMYYY(dateOfBirth),
            ...info
          })
        }
      }
      return acc;
    }, [])

    const total = (await AppointmentSchedule.find({doctorId, statusAppointment: StatusAppointment.done, approve: ScheduleRequestStatus.accpect })
      .populate({
        path: schemaFields.patientId,
        populate: {
          path: schemaFields.userId,
          match: {
            fullname: { $regex: new RegExp(searchKey, 'i') }
          }
        }
      }).lean()).reduce((acc, cur) => {
        if(cur.patientId) {
          const { userId: user } = cur.patientId as any;
          if(user) {
            acc.push(cur)
          }
        }
        return acc;
      }, [])
    
    return {
      values,
      total: total.length
    }
  }

  public static getHistoryMedicalDetails = async (id, isForDoctor: boolean) => {
    let data;
    let info;
    const _path = isForDoctor ? schemaFields.patientId : schemaFields.doctorId;
    const schedule = await AppointmentSchedule.findById(id)
    .select(`-__v -${schemaFields.statusUpdateTime} -${schemaFields.approve}`)
    .populate({
      path: _path,
      populate: {
        path: schemaFields.userId,
        select: `${schemaFields.fullname} ${schemaFields.email} ${schemaFields.phonenumber} ${schemaFields.address} ${schemaFields.dateOfBirth} ${schemaFields.gender} ${schemaFields._id} ${schemaFields.identification}`
      }
    })
    .populate({
      path: schemaFields.departmentId,
    })
    .lean();
    const { departmentId: department, appointmentDate, ...otherInschedule } = schedule;
    if(!isForDoctor) {
      const { _id: doctorId, userId: user, rank, position } = schedule.doctorId as any;
      const { _id: userId, dateOfBirth, ...infomation  } = user as any;
      info = {
        userId,
        doctorId,
        rank,
        position,
        dateOfBirth: MomentTimezone.convertDDMMYYY(dateOfBirth),
        ...infomation
      }
    } else {
      const { _id: patientId, userId: user, insurance } = schedule.patientId as any;
      const { _id: userId, dateOfBirth, ...infomation  } = user as any;
      info = {
        userId,
        patientId,
        insurance,
        dateOfBirth: MomentTimezone.convertDDMMYYY(dateOfBirth),
        ...infomation
      }
    }
    const { _id: departmentId, departmentName } = department as any;
    const { _id: historyId, diagnosis, ...historyMedical} = await Histories.findOne({appointmentScheduleId: id})
    .select(`-__v -${schemaFields.appointmentScheduleId}`)
    .lean()
    const testResult = await testService.getAllTestServiceInHistory(historyId);
    const { medicationId, note } = await prescriptionService.findOneByKey(schemaFields.historyId, historyId);
    const medication = await Promise.all(medicationId.split(",").map(item=>item.trim()).map(medication => MedicationService.findOneById(medication)));
    const diseases = await Promise.all(diagnosis.split(",").map(item=>item.trim()).map(e => DiseasesService.findOneById(e)));

    data = {
      appointmentDate: MomentTimezone.convertDDMMYYY(appointmentDate),
      ...otherInschedule,
      departmentId,
      departmentName,
      ...info,
      historyId,
      ...historyMedical,
      testResult,
      medication,
      diseases,
      note
    }
    return data;
  }
}