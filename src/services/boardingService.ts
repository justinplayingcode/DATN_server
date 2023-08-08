import mongoose from "mongoose";
import { ICreateBoarding, IEditBoarding } from "../models/Patient";
import Boarding from "../schema/Boarding";
import { Onboarding } from "../utils/enum";
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
  public static getTotalInPatientWithDepartment = async (departmentId) => {
    try {
      const total = await Boarding.find({ departmentId, boardingStatus: Onboarding.inpatient }).countDocuments();
      return total;
    } catch (error) {
      throw error;
    }
  }
  public static getTotalOnboardingPerMonth = async () => {
    try {
      const today = new Date();
      const twelveMonthsAgo = new Date(today.getTime() - 12 * 30 * 24 * 60 * 60 * 1000);
      const _result = await Boarding.aggregate([
        {
          $match: {
            onBoardingDate: { $gte: twelveMonthsAgo, $lte: today }, 
            boardingStatus: { $in: [Onboarding.inpatient, Onboarding.outpatient] }
          },
        },
        {
          $group: {
            _id: {
              year: { $year: '$onBoardingDate' },
              month: { $month: '$onBoardingDate' },
            },
            inCount: {
              $sum: { $cond: [{ $eq: ['$boardingStatus', Onboarding.inpatient] }, 1, 0] },
            },
            outCount: {
              $sum: { $cond: [{ $eq: ['$boardingStatus', Onboarding.outpatient] }, 1, 0] },
            },
          },
        },
        {
          $project: {
            _id: 0,
            month: {
              $concat: [
                { $toString: '$_id.year' },
                '-',
                { $cond: [{ $lte: ['$_id.month', 9] }, { $concat: ['0', { $toString: '$_id.month' }] }, { $toString: '$_id.month' }] },
              ],
            },
            inCount: {
              $ifNull: ['$inCount', 0],
            },
            outCount: {
              $ifNull: ['$outCount', 0],
            },
          },
        },
        {
          $sort: { month: -1 },
        },
      ])
      const months = [];
      for (let i = 0; i < 12 ; i++) {
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const year = firstDayOfMonth.getFullYear();
        const month = firstDayOfMonth.getMonth() + 1; 
        const monthString = `${year}-${month.toString().padStart(2, '0')}`;
        months.push(monthString);
      }

      for (const _month of months) {
        const monthData = _result.find(item => item.month === _month);
        if (!monthData) {
          _result.push({
            month: _month,
            inCount: 0,
            outCount: 0,
          });
        }
      }
      return _result.sort((a, b) => {
        return a.month > b.month ? -1 : 1;
      });
    } catch (error) {
      throw error
    }
  }

  public static getTotalOnboardingPerMonthByDoctor = async (departmentId) => {
    try {
      const today = new Date();
      const twelveMonthsAgo = new Date(today.getTime() - 12 * 30 * 24 * 60 * 60 * 1000);
      const _result = await Boarding.aggregate([
        {
          $match: {
            onBoardingDate: { $gte: twelveMonthsAgo, $lte: today }, 
            boardingStatus: { $in: [Onboarding.inpatient, Onboarding.outpatient] },
            departmentId: new mongoose.Types.ObjectId(departmentId)
          },
        },
        {
          $group: {
            _id: {
              year: { $year: '$onBoardingDate' },
              month: { $month: '$onBoardingDate' },
            },
            inCount: {
              $sum: { $cond: [{ $eq: ['$boardingStatus', Onboarding.inpatient] }, 1, 0] },
            },
            outCount: {
              $sum: { $cond: [{ $eq: ['$boardingStatus', Onboarding.outpatient] }, 1, 0] },
            },
          },
        },
        {
          $project: {
            _id: 0,
            month: {
              $concat: [
                { $toString: '$_id.year' },
                '-',
                { $cond: [{ $lte: ['$_id.month', 9] }, { $concat: ['0', { $toString: '$_id.month' }] }, { $toString: '$_id.month' }] },
              ],
            },
            inCount: {
              $ifNull: ['$inCount', 0],
            },
            outCount: {
              $ifNull: ['$outCount', 0],
            },
          },
        },
        {
          $sort: { month: -1 },
        },
      ])
      const months = [];
      for (let i = 0; i < 12 ; i++) {
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const year = firstDayOfMonth.getFullYear();
        const month = firstDayOfMonth.getMonth() + 1; 
        const monthString = `${year}-${month.toString().padStart(2, '0')}`;
        months.push(monthString);
      }

      for (const _month of months) {
        const monthData = _result.find(item => item.month === _month);
        if (!monthData) {
          _result.push({
            month: _month,
            inCount: 0,
            outCount: 0,
          });
        }
      }
      return _result.sort((a, b) => {
        return a.month > b.month ? -1 : 1;
      });
    } catch (error) {
      throw error
    }
  }
}