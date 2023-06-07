import { ICreateHistory } from "../models/Histories";
import Histories from "../schema/Histories"

export default class HistoriesService {

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
}