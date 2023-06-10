import { ClientSession } from "mongoose";
import { ICreatePatient } from "../models/Patient";
import Patient from "../schema/Patient"
import { schemaFields } from "../utils/constant";
import MomentTimezone from "../helpers/timezone";

export default class PatientService {
  public static totalCount = async () => {
    return await Patient.countDocuments();
  }

  public static createPatient = async (obj: ICreatePatient, session: ClientSession) => {
    try {
      const patient = new Patient(obj);
      return await patient.save({ session });
    } catch (error) {
      throw error;
    }
  }

  public static getAll = async (page: number, pageSize: number, searchKey: string) => {
    const patients = await (await Patient.find()
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .select(`-__v`)
      .populate({
        path: schemaFields.userId,
        select: `${schemaFields.fullname} ${schemaFields.email} ${schemaFields.phonenumber} ${schemaFields.address} ${schemaFields.dateOfBirth} ${schemaFields.gender} ${schemaFields._id} ${schemaFields.identification}`,
        match: {
          fullname: { $regex: new RegExp(searchKey, 'i') }
        }
      })
      .lean())?.reduce((acc, cur) => {
        if(cur.userId) {
          const { dateOfBirth, _id, ...userInfo } = cur.userId as any;
          acc.push({
                ...userInfo,
                userId: _id,
                dateOfBirth: MomentTimezone.convertDDMMYYY(dateOfBirth),
                insurance: cur.insurance,
                hospitalization: cur.hospitalization
              })
        }
        return acc
      }, []);

    const totalPatients = await (await Patient.find()
      .populate({
        path: schemaFields.userId,
        select: `${schemaFields.fullname} ${schemaFields.email} ${schemaFields.phonenumber} ${schemaFields.address} ${schemaFields.dateOfBirth} ${schemaFields.gender} ${schemaFields._id} ${schemaFields.identification}`,
        match: {
          fullname: { $regex: new RegExp(searchKey, 'i') }
        }
      })
      .lean())?.reduce((acc, cur) => {
        if(cur.userId) {
          acc.push(cur)
        }
        return acc
      }, [])

    return {
      values: patients,
      total: totalPatients.length
    };

  }

  public static findOneByInsuranceToRegister = async (insurance: string) => {
    return await Patient.find({ insurance }).populate({
        path: schemaFields.userId,
        select: `${schemaFields.fullname} ${schemaFields.address} ${schemaFields.dateOfBirth} ${schemaFields.gender} ${schemaFields.phonenumber}`
    }).lean();
  }

  public static findByUserId = async (userId) => {
    return await Patient.findOne({ userId })
      .select(`-__v`)
      .lean();
  }

  public static getInfoByUserId = async (id) => {
    const { _id, userId, ...info} = await Patient.findOne({ userId: id})
      .populate({
        path: schemaFields.userId,
        select: `${schemaFields.fullname} ${schemaFields.email} ${schemaFields.phonenumber} ${schemaFields.address} ${schemaFields.dateOfBirth} ${schemaFields.gender} ${schemaFields._id} ${schemaFields.identification} -${schemaFields._id}`
      })
      .select(`-__v`)
      .lean();

    const respone = {
      patientId: _id,
      ...userId,
      ...info
    }

    return respone;
  }

  public static findOneById = async (id) => {
    return await Patient.findById(id).lean();
  }
}