import { ICreateMedication } from "../models/Data/objModel";
import { schemaFields } from "../models/Data/schema";
import Medications from "../models/Schema/Medications";

export default class MedicationService {
  public static create = async (obj: ICreateMedication) => {
    return await Medications.create(obj);
  }
  public static getAll = async () => {
    return await Medications.find({})
  }
  public static findOne = async (id) => {
    return await Medications.findById(id, {
      select: `-${schemaFields._id} -__v`
    });
  }
  public static editOne = async (name: string, obj) => {
    return await Medications.findOneAndUpdate( { name: name }, obj, { new: true} )
  }
}