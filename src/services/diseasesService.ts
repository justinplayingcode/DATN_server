import { ICreateDiseases } from "../models/Diseases";
import Diseases from "../schema/Diseases";
import { schemaFields } from "../utils/constant";

export default class DiseasesService {
  public static create = async (obj: ICreateDiseases) => {
    return await Diseases.create(obj);
  }
  public static totalCount =async () => {
    return await Diseases.countDocuments({ isActive: true });
  }
  public static getAll = async (page: number, pageSize: number, searchKey: string) => {
    const data = await Diseases.find({ isActive: true, name: { $regex: searchKey, $options: "i" } })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .select(`-__v -${schemaFields.isActive}`)
    .populate({
      path: schemaFields.departmentId,
    })
    .lean();

    const total = await Diseases.find({ isActive: true, name: { $regex: searchKey, $options: "i" } }).countDocuments();

    const values = data.map(e => {
      const { departmentName, _id } = e.departmentId as any;
      return {
        ...e,
        department: departmentName,
        departmentId: _id
      }
    })
    
    return {
      values,
      total
    }
  }
  public static findOne = async (id) => {
    return await Diseases.findById(id, {
      select: `-${schemaFields._id} -__v`
    });
  }
  public static editOne = async (id, obj: ICreateDiseases) => {
    return await Diseases.findByIdAndUpdate( id, obj, { new: true, runValidators: true} )
  }
}