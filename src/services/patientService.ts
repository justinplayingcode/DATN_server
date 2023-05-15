import { ClientSession } from "mongoose"
import { ICreatePatient } from "../models/Data/objModel"
import { schemaFields, statusAppointment } from "../models/Data/schema"
import Patient from "../models/Schema/Patient"

export default class PatientService {
    public static createPatient = async (obj: ICreatePatient, session: ClientSession) => {
      try {
        const patient = new Patient(obj);
        return await patient.save({ session });
      } catch (error) {
        throw error;
      }
    }

    public static getAll = async () => {
        return await Patient.find().populate({
            path: schemaFields.userId,
            select: `${schemaFields.fullname} ${schemaFields.address} ${schemaFields.dateOfBirth} ${schemaFields.identification} -${schemaFields._id}`
        }).lean();
    }

    public static findOneByUserId = async (id) => {
        return await Patient.findOne({ userId: id}).populate({
            path: schemaFields.userId,
            select: `${schemaFields.fullname} ${schemaFields.phonenumber} ${schemaFields.email} ${schemaFields.identification} ${schemaFields.gender} ${schemaFields.address} ${schemaFields.dateOfBirth}`
        }).lean();
    }

    public static findOneByInsurance = async (insurance: string) => {
        return  await Patient.find({ insurance: { $regex: insurance } }).populate({
            path: schemaFields.userId,
            select: `${schemaFields.fullname} ${schemaFields.address} ${schemaFields.dateOfBirth}`
        }).lean();
    }

    public static getAllWait = async (isOnboarding: boolean) => {
        return await Patient.find({ boarding: { $eq: isOnboarding }, status: { $eq: statusAppointment.wait} }).populate({
            path: schemaFields.userId,
            select: `${schemaFields.fullname} ${schemaFields.email} ${schemaFields.phonenumber} ${schemaFields.address} ${schemaFields.dateOfBirth} ${schemaFields.gender} -${schemaFields._id}`
        }).lean();
    }

    public static findOneAndUpdateDepartment = async (userId, newDepartment, session: ClientSession) => {
      try {
        await Patient.findOneAndUpdate({ userId: userId}, { department: newDepartment }, { session: session})
      } catch (error) {
        throw (error)
      }
    }

    public static findOneCurrentInfoPatientByUserId = async (id) => {
      return await Patient.findOne({ userId: id})
        .select(` -__v -${schemaFields.department} -${schemaFields.hospitalization}`)
        .lean();
  }

}