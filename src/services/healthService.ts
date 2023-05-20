import { ClientSession } from "mongoose"
import { IHealth } from "../models/Data/objModel"
import Health from "../models/Schema/Health"

export default class HealthService {
    public static create = async (obj: IHealth) => {
        return await Health.create(obj)
    }
    public static createDefault = async (patientId, session: ClientSession) => {
      try {
        const obj = {
            patient: patientId,
            heartRate: 0,
            temperature: 0,
            bloodPressure: {
                systolic: 0,
                diastolic: 0
            },
            glucose: 0,
            weight: 0,
            height: 0,
            medicalHistory: []
        }
        const health = new Health(obj);
        return health.save({ session: session});
      } catch (error) {
        throw error
      }
    }
    public static findOneByPatientId = async (patientId) => {
        return await Health.findOne({patient: patientId})
    }
}