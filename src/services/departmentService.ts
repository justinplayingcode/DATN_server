import { ICreateDepartment } from "../models/Department";
import Department from "../schema/Department";
import { schemaFields } from "../utils/constant";
import DoctorService from "./doctorService";


export default class DepartmentService {
    public static create = async (obj: ICreateDepartment) => {
        return await Department.create(obj);
    }
    public static getAllOption = async () => {
        return await Department
          .find({ isActive: true })
          .select(`-__v -${schemaFields.isActive}`)
          .lean()
    }
    public static findOneDepartment = async (id) => {
      return await Department.findById(id);
    }
    public static findOneDepartmentName = async (id) => {
      const obj = await Department.findById(id);
      return obj.departmentName;
    }
    public static getAllDepartmentForTable = async (page: number, pageSize: number, searchKey: string) => {
      const value = (await Department
      .find({ departmentName: { $regex: searchKey, $options: "i" }})
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .select(`-__v -${schemaFields.isActive}`)
      .lean())?.reduce( async (acc, cur) => {
        const totalDoctors = await DoctorService.getTotalDoctorsInDepartment(cur._id);
        (await acc).push({
          ...cur,
          totalDoctors
        });
        return acc;
      }, Promise.resolve([]));
      const values = await value;
      const total = await Department
      .find({ departmentName: { $regex: searchKey, $options: "i" }})
      .countDocuments();

      return {
        values,
        total
      }
    }
    // public static 
}