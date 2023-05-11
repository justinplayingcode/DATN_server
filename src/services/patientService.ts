import { ICreatePatient } from "../models/Data/objModel"
import { schemaFields } from "../models/Data/schema"
import Patient from "../models/Schema/Patient"

export default class PatientService {
    public static createPatient = async (obj: ICreatePatient) => {
        return await Patient.create(obj)
    }

    public static findOneByUserId = async (id) => {
        return await Patient.findOne({ userId: id}).populate({
            path: schemaFields.userId,
            select: `${schemaFields.fullname} ${schemaFields.address} ${schemaFields.dateOfBirth} ${schemaFields.identification} -${schemaFields._id}`
        }).lean()
    }

    public static findOneByInsurance = async (insurance: string) => {
        return  await Patient.find({ insurance: { $regex: insurance } }).populate({
            path: schemaFields.userId,
            select: `${schemaFields.fullname} ${schemaFields.address} ${schemaFields.dateOfBirth}`
        }).lean();
    }
}