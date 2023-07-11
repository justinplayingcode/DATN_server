import { ICreateHistory } from "../models/Histories";
import AppointmentSchedule from "../schema/AppointmentSchedule";
import Histories from "../schema/Histories"
import { schemaFields } from "../utils/constant";
import { StatusAppointment } from "../utils/enum";

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
    const values = []
    
    return {
      values,
      total: 0
    }
  }
  public static getHistoryMedicalOfDoctor = async (page: number, pageSize: number, searchKey: string, doctorId) => {
    const values = await AppointmentSchedule.find({ doctorId, statusAppointment: StatusAppointment.done, approve: true })
    .sort({ statusUpdateTime: 1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .select(`-__v -${schemaFields.statusUpdateTime} -${schemaFields.approve}`)
    
    return {
      values,
      total: 0
    }
  }
}