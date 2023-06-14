import { ClientSession } from "mongoose"
import Health from "../schema/Health"
import { ICreateHealth } from "../models/Health"

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

    public static getAllPatientOnBoarding = async (page: number, pageSize: number, searchKey: string, departmentId, boardingStatus) => {
      // viet sau
      const values = []
      
      return {
        values,
        total: 0
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