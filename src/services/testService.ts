import { ITestService } from "../models/Test";
import TestResult from "../schema/TestResult"
import TestService from "../schema/TestService";
import { schemaFields } from "../utils/constant"
import { TypeTestService } from "../utils/enum";

export default class testService {
  public static createTestservice = async (service: TypeTestService, price: number) => {
    try {
      const serviceObj: ITestService = {
        service,
        price
      }
      return await TestService.create(serviceObj);
    } catch (error) {
      throw error
    }
  }

  public static getAllTestServiceInHistory = async (historyId) => {
    return await TestResult
      .find({ historyId })
      .populate({
        path: schemaFields.serviceId,
        select: `${schemaFields.service}`
      })
      .lean();
  }

  public static getListTestService = async () => {
    return await TestService.find()
      .select(`${schemaFields.service}`)
      .lean()
  }

  public static createTestResult = async (obj, session) => {
    try {
      const newResult = new TestResult(obj);
      return await newResult.save({ session });
    } catch (error) {
      throw error
    }
  }

  public static updateTestResultById = async (id, update, session) => {
    try {
      return await TestResult.findByIdAndUpdate( id, update, { new: true, runValidators: true, session} );
    } catch (error) {
      throw error
    }
  }
}