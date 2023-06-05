import { ClientSession } from "mongoose";
import Doctor from "../schema/Doctor"
import { schemaFields } from "../utils/constant";
import { ICreateDoctor } from "../models/Doctor";
import MomentTimezone from "../helpers/timezone";

export default class DoctorService {
    public static totalCount = async () => {
      return await Doctor.countDocuments({ isActive: true });
    }
    public static createDoctor = async (obj: ICreateDoctor, session: ClientSession) => {
      try {
        const doctor = new Doctor(obj);
        return await doctor.save({ session });
      } catch (error) {
        throw error;
      }
    }
    public static findOneByUserId = async (id) => {
        return await Doctor.findOne({ userId: id}).populate({
            path: schemaFields.userId,
            select: `${schemaFields.fullname} ${schemaFields.address} ${schemaFields.dateOfBirth} ${schemaFields.identification} -${schemaFields._id}`
        }).lean();
    } 
    public static getAll = async (page: number, pageSize: number, searchKey: string) => {
        const doctors = await Doctor.find({ isActive: true })
          .skip((page - 1) * pageSize)
          .limit(pageSize)
          .select(`-__v -${schemaFields.isActive}`)
          .populate({
            path: schemaFields.userId,
            select: `${schemaFields.fullname} ${schemaFields.email} ${schemaFields.phonenumber} ${schemaFields.address} ${schemaFields.dateOfBirth} ${schemaFields.gender} ${schemaFields._id} ${schemaFields.identification}`,
            match: {
              fullname: { $regex: new RegExp(searchKey, 'i') }
            }
          })
          .populate({ path: schemaFields.departmentId, select: `${schemaFields.departmentName}` })
          .lean();
        
        const response = doctors.reduce((acc, curr) => {
          if(curr.userId) {
            const { dateOfBirth, _id, ...userInfo } = curr.userId as any;
            const { departmentName } = curr.departmentId as any;
            acc.push({
              position: curr.position,
              rank: curr.rank,
              ...userInfo,
              userId: _id,
              departmentName,
              dateOfBirth: MomentTimezone.convertDDMMYYY(dateOfBirth)
            })
          }
          return acc;
        }, []);

        const total = await (await Doctor.find({ isActive: true })
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
          values: response, 
          total: total.length 
        }
    }

    public static getInfor = async (userId) => {
      return await Doctor.findOne({ userId: userId} )
        .populate({
          path: schemaFields.departmentId,
          select: `-__v`
        })
        .lean();
    }

    public static getAllDoctorsInDepartment = async (departmentId) => {
      
    }
    public static getTotalDoctorsInDepartment = async (departmentId) => {
      return await Doctor.find({ departmentId }).countDocuments();
    }
}