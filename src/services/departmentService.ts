import { ICreateDepartment } from "../models/Department";
import Department from "../schema/Department";
import { schemaFields } from "../utils/constant";


export default class DepartmentService {
    public static create = async (obj: ICreateDepartment) => {
        return await Department.create(obj);
    }
    public static getAll = async () => {
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
}