import { ICreatePatient } from "../models/Data/objModel"
import Patient from "../models/Schema/Patient"

export default class PatientService {
    public static createPatient = async (obj: ICreatePatient) => {
        return await Patient.create(obj)
    }

    public static findOneByUserId = async (id) => {
        return await Patient.findOne({ userId: id})
    }

    public static findOneByInsurance = async (insurance: string) => {
        return await Patient.find({ insurance: { $regex: insurance } })
    }
}