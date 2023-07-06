import { ICreateHistory } from "../models/Histories";
import Histories from "../schema/Histories"

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

  public static getHistoryMedicalOfPatient = async (page: number, pageSize: number, searchKey: string, userId) => {
    // viet sau
    const values = []
    
    return {
      values,
      total: 0
    }
  }
  public static getHistoryMedicalOfDoctor = async (page: number, pageSize: number, searchKey: string, userId) => {
    // viet sau
    const values = []
    
    return {
      values,
      total: 0
    }
  }
}