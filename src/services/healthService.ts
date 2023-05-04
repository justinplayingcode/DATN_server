import { ICreateHealth } from "../models/Data/objModel"
import Health from "../models/Schema/Health"

export default class HealthService {
    public static create = async (obj: ICreateHealth) => {
        return await Health.create(obj)
    }
    public static createDefault = async (patientId) => {
        const obj = {
            patient: patientId,
            heartRate: 0,
            temperature: 0,
            bloodPressureSystolic: 0,
            bloodPressureDiastolic: 0,
            glucose: 0,
            weight: 0,
            height: 0,
            medicalHistory: []
        }
        return await Health.create(obj)
    }
    public static findOneByPatientId = async (patientId) => {
        return await Health.findOne({patient: patientId})
    }
}