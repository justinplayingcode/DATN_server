import { IMedication } from "../models/Data/objModel";
import { schemaFields } from "../models/Data/schema";
import Medications from "../models/Schema/Medications";

export default class MedicationService {
  public static create = async (obj: IMedication) => {
    return await Medications.create(obj);
  }
  public static getAll = async () => {
    return await Medications.find({}, { __v: 0 })
  }
  public static findOne = async (id) => {
    return await Medications.findById(id, {
      select: `-${schemaFields._id} -__v`
    });
  }
  public static editOne = async (id, obj: IMedication) => {
    return await Medications.findByIdAndUpdate( id, obj, { new: true, runValidators: true} )
  }
}