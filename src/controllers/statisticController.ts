import DepartmentService from "../services/departmentService"
import DoctorService from "../services/doctorService";
import { ApiStatus, ApiStatusCode } from "../utils/enum";


export default class StatisticController {

  //GET
  public static getDoctorWithDepartment = async (req, res, next) => {
    try {
      const departments = await DepartmentService.getAllOption();
      const _result = departments.reduce(async (acc, cur) => {
          (await acc).push(
            {
              departmentName: cur.departmentName,
              total: await DoctorService.getTotalDoctorsInDepartment(cur._id)
            }
          )
          return acc;
      }, Promise.resolve([]));
      const result = await _result;
      res.status(ApiStatusCode.OK).json({
        status: ApiStatus.succes,
        data: result
      })
    } catch (error) {
      next(error)
    }
  }

  //GET
  // số lượng bệnh nhân điều trị nội trú theo khoa
  public static getPatientsOnboardingWithDepartment =async () => {
    
  }

  //GET
  // số lượng khám bệnh trong 7 ngày qua
  public static getTotalHistoryInLast7Day =async () => {
    
  }

  //GET
  // số lượng bệnh nhân nhập viện mỗi tháng
  public static getPatientsOnboarding =async () => {
    
  }

}