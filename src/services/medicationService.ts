import { ICreateMedication } from "../models/Medications";
import Medications from "../schema/Medications";
import { schemaFields } from "../utils/constant";

export default class MedicationService {
  public static create = async (obj: ICreateMedication) => {
    return await Medications.create(obj);
  }
  public static getAll = async (page, pageSize, searchKey) => {
    const values = await Medications
      .find({ isActive: true, name: { $regex: searchKey, $options: "i" } }, { __v: 0 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .select(`-${schemaFields.isActive}`)
      .lean();

    const total = await Medications
    .find({ isActive: true, name: { $regex: searchKey, $options: "i" } }, { __v: 0 }).countDocuments();

    return {
      values,
      total
    }
  }
  public static findOneById = async (id) => {
    return await Medications.findById(id).select(`-__v -${schemaFields.isActive} -_id`).lean();
  }
  public static editOne = async (id, obj: ICreateMedication) => {
    return await Medications.findByIdAndUpdate( id, obj, { new: true, runValidators: true} )
  }
  public static findOneByName = async (searchKey) => {
    return await Medications.find({ name: { $regex: new RegExp(searchKey, 'i') } })
  }
}