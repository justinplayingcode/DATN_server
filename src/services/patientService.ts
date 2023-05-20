import { ClientSession } from "mongoose"
import { IPatient } from "../models/Data/objModel"
import { schemaFields, statusAppointment } from "../models/Data/schema"
import Patient from "../models/Schema/Patient"

export default class PatientService {
    public static createPatient = async (obj: IPatient, session: ClientSession) => {
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
            select: `-__v -${schemaFields.role} -${schemaFields.password} -${schemaFields.username}`
        }).lean();
    }

    public static findOneByUserId = async (id) => {
        return await Patient.findOne({ userId: id}).populate({
            path: schemaFields.userId,
            select: `${schemaFields.fullname} ${schemaFields.phonenumber} ${schemaFields.email} ${schemaFields.identification} ${schemaFields.gender} ${schemaFields.address} ${schemaFields.dateOfBirth}`
        }).lean();
    }

    public static findOneByInsuranceToRegister = async (insurance: string) => {
        return  await Patient.find({ insurance: insurance, status: statusAppointment.done }).populate({
            path: schemaFields.userId,
            select: `${schemaFields.fullname} ${schemaFields.address} ${schemaFields.dateOfBirth} ${schemaFields.gender} ${schemaFields.phonenumber}`
        }).lean();
    }

    public static getAllWait = async (isOnboarding: boolean, department) => {
        return await Patient.find({ boarding: { $eq: isOnboarding }, status: { $eq: statusAppointment.wait}, department: { $eq: department} }).populate({
            path: schemaFields.userId,
            select: `${schemaFields.fullname} ${schemaFields.email} ${schemaFields.phonenumber} ${schemaFields.address} ${schemaFields.dateOfBirth} ${schemaFields.gender} -${schemaFields._id}`
        }).lean();
    }

    public static getAllWaitRegister = async (isOnboarding: boolean) => {
      return await Patient.find({ boarding: { $eq: isOnboarding }, status: { $eq: statusAppointment.wait} }).populate({
          path: schemaFields.userId,
          select: `${schemaFields.fullname} ${schemaFields.email} ${schemaFields.phonenumber} ${schemaFields.address} ${schemaFields.dateOfBirth} ${schemaFields.gender} -${schemaFields._id}`
      }).lean();
    }

    public static getAllTesting = async (isOnboarding: boolean) => {
      return await Patient.find({ boarding: { $eq: isOnboarding }, status: { $eq: statusAppointment.testing} }).populate({
          path: schemaFields.userId,
          select: `${schemaFields.fullname} ${schemaFields.email} ${schemaFields.phonenumber} ${schemaFields.address} ${schemaFields.dateOfBirth} ${schemaFields.gender} -${schemaFields._id}`
      }).lean();
    }

    public static registerFindOneAndUpdateDepartment = async (userId, newDepartment, session: ClientSession) => {
      try {
        await Patient.findOneAndUpdate({ userId: userId}, { department: newDepartment, status: statusAppointment.wait }, { session: session})
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