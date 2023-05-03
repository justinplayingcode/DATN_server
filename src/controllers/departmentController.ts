import { ApiStatus, ApiStatusCode } from "../models/Data/apiStatus";
import ReqBody from "../models/Data/reqBody"
import DepartmentService from "../services/departmentService";
import validateReqBody from "../utils/validateReqBody"

export default class DepartmentController {
    //POST
    public static createDepartment = async (req, res, next) => {
        try {
            validateReqBody(req, ReqBody.newDepartment, next)
            const department = await DepartmentService.create(req.body);
            res.status(ApiStatusCode.OK).json({
                status: ApiStatus.succes,
                data: department
            })
        } catch (err) {
            next(err)
        }
    }

    //GET
    public static getAllDepartment = async (req, res, next) => {
        try {
            const departments = await DepartmentService.getAll();
            res.status(ApiStatusCode.OK).json({
                status: ApiStatus.succes,
                data: departments
            })
        } catch (e) {
            next(e)
        }
    }

    //POST
    public static updateOneDepartment = async (req, res, next) => {

    }
}
