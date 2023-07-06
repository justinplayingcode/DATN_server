import { ClientSession } from "mongoose"
import Health from "../schema/Health"
import { ICreateHealth, IUpdateHealth } from "../models/Health"

export default class HealthService {
    public static create = async (obj: ICreateHealth) => {
        return await Health.create(obj)
    }
    public static createDefault = async (patientId, session: ClientSession) => {
      try {
        const obj = {
            patientId: patientId,
            heartRate: 0,
            temperature: 0,
            bloodPressureSystolic: 0,
            bloodPressureDiastolic: 0,
            glucose: 0,
            weight: 0,
            height: 0
        }
        const health = new Health(obj);
        return health.save({ session: session});
      } catch (error) {
        throw error
      }
    }
    public static findOneByPatientId = async (patientId) => {
        return await Health.findOne({ patientId })
    }
    public static updateHeathByPatientId = async (patientId, obj: IUpdateHealth, session: ClientSession) => {
      try {
        await Health.findOneAndUpdate({patientId}, obj, {runValidators: true, session});
      } catch (error) {
        throw error;
      }
    }
}