import { ClientSession } from "mongoose";
import { ICreateBill } from "../models/Bill";
import Bill from "../schema/Bill";

export default class billService {

  public static create = async (obj: ICreateBill, session: ClientSession) => {
    try {
      const newBill = new Bill(obj);
      return await newBill.save({ session });
      
    } catch (error) {
      throw error;
    }
  }

  public static findByHistoryId = async (historyId) => {
    return await Bill.find({ historyId }).select("-__v").lean();
  }

}