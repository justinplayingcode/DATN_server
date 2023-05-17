import { ICreateDepartment } from "../models/Data/objModel";
import Department from "../models/Schema/Department";


export default class DepartmentService {
    public static create = async (obj: ICreateDepartment) => {
        return await Department.create(obj);
    }
    public static getAll = async () => {
        return await Department.find({})
    }
    public static findOneDepartmentCode = async (id) => {
        const obj = await Department.findById(id);
        return obj.code;
    }
}