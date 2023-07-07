import { ICreateBoarding, IEditBoarding } from "../models/Patient";
import Boarding from "../schema/Boarding";
export default class boardingService {
  public static create = async (newBoarding: ICreateBoarding, session) => {
    try {
      const obj = {
        ...newBoarding,
        onBoardingDate: new Date()
      }
      const boarding = new Boarding(obj);
      return await boarding.save({ session })
    } catch (error) {
      throw error
    }
  }
  public static findOneByKey = async (key, value) => {
    return await Boarding.findOne({ [key]: value }).lean();
  }
  public static updateByPatientId = async (patientId, updateObject: IEditBoarding, session) => {
    try {
      await Boarding.findOneAndUpdate({ patientId}, updateObject, { session, runValidators: true });
    } catch (error) {
      throw error
    }
  }
}