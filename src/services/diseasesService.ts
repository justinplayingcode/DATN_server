import { IDiseases } from "../models/Data/objModel";
import { schemaFields } from "../models/Data/schema";
import Diseases from "../models/Schema/Diseases";

export default class DiseasesService {
  public static create = async (obj: IDiseases) => {
    return await Diseases.create(obj);
  }
  public static getAll = async () => {
    return await Diseases.find({}, { __v: 0 })
  }
  public static findOne = async (id) => {
    return await Diseases.findById(id, {
      select: `-${schemaFields._id} -__v`
    });
  }
  public static editOne = async (id, obj: IDiseases) => {
    return await Diseases.findByIdAndUpdate( id, obj, { new: true} )
  }
}