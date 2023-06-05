import DepartmentService from "../services/departmentService";
import { TableResponseNoData } from "../utils/constant";
import { ApiStatus, ApiStatusCode, TableType } from "../utils/enum";
import validateReqBody, { ReqBody } from "../utils/requestbody"

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
            const departments = await DepartmentService.getAllOption();
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

    //POST
    public static getAllForTable = async (req, res, next) => {
      try {
        validateReqBody(req, ReqBody.getTableValues, next);
        let data;

        switch(req.body.tableType) {
          case TableType.departments:
            data = await DepartmentService.getAllDepartmentForTable(req.body.page, req.body.pageSize, req.body.searchKey)
            break;
          default:
            data = TableResponseNoData; 
        }
        res.status(ApiStatusCode.OK).json({
          status: ApiStatus.succes,
          data: data
        });
      } catch (error) {
        next(error)
      }
    }
}
