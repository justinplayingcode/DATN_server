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
    const values = await Diseases.find({ isActive: true, diseasesName: { $regex: searchKey, $options: "i" } })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .select(`-__v -${schemaFields.isActive}`)
    .lean()

    const totals = await Diseases.find({ isActive: true, diseasesName: { $regex: searchKey, $options: "i" } })
    .select(`-__v -${schemaFields.isActive}`)
    .lean()

    return {
      values,
      total: totals.length
    }
  }
  public static findOneById = async (id) => {
    return await Diseases.findById(id).select(`-${schemaFields._id} -__v -${schemaFields.isActive} -_id`).lean();
  }
  public static editOne = async (id, obj: ICreateDiseases) => {
    return await Diseases.findByIdAndUpdate( id, obj, { new: true, runValidators: true} )
  }
  public static fineOneByName = async (searchKey) => {
    return await Diseases.find({ isActive: true, diseasesName: { $regex: new RegExp(searchKey, 'i') } })
  }
  public static fineOneAndDelete = async (id) => {
    return await Diseases.findByIdAndUpdate( id, {isActive: false}, { new: true, runValidators: true} )
  } 
}