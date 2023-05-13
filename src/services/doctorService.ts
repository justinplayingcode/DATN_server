import { ICreateDoctor } from "../models/Data/objModel"
import { schemaFields } from "../models/Data/schema"
import Doctor from "../models/Schema/Doctor"

export default class DoctorService {
    public static createDoctor = async (obj: ICreateDoctor) => {
        return await Doctor.create(obj)
    }
    public static findOneByUserId = async (id) => {
        return await Doctor.findOne({ userId: id}).populate({
            path: schemaFields.userId,
            select: `${schemaFields.fullname} ${schemaFields.address} ${schemaFields.dateOfBirth} ${schemaFields.identification} -${schemaFields._id}`
        }).lean();
    } 
    public static getAll = async () => {
        return await Doctor.find()
          .populate({
            path: schemaFields.userId,
            select: `${schemaFields.fullname} ${schemaFields.email} ${schemaFields.phonenumber} ${schemaFields.address} ${schemaFields.dateOfBirth} ${schemaFields.gender} -${schemaFields._id}`})
          .populate({ path: schemaFields.department, select: `${schemaFields.name}` })
          .lean();
    }

    public static getInfor = async (userId) => {
      return await Doctor.findOne({ userId: userId} )
        .populate({
          path: schemaFields.department,
          select: `-${schemaFields.code} -__v`
        })
        .select(`${schemaFields.department} -${schemaFields._id} ${schemaFields.rank} ${schemaFields.position}`)
        .lean();
    }
}