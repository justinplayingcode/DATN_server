import { ICreateDiseases } from "../models/Data/objModel";
import { schemaFields } from "../models/Data/schema";
import Diseases from "../models/Schema/Diseases";

export default class DiseasesService {
  public static create = async (obj: ICreateDiseases) => {
    return await Diseases.create(obj);
  }
  public static getAll = async () => {
    return await Diseases.find({})
  }
  public static findOne = async (id) => {
    return await Diseases.findById(id, {
      select: `-${schemaFields._id} -__v`
    });
  }
  public static editOne = async (name: string, obj) => {
    return await Diseases.findOneAndUpdate( { name: name }, obj, { new: true} )
  }
}