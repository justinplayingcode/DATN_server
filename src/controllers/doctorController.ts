import { ApiStatus, ApiStatusCode } from "../models/Data/apiStatus";
import { Role, schemaFields } from "../models/Data/schema";
import DoctorService from "../services/doctorService";
import UserService from "../services/userService";
import Message from "../utils/message";

export default class DoctorController {
  // GET
  public static getAllDoctor = async (req, res, next) => {
      try {
          const { userId } = req.user;
          const { role } = await UserService.findOneUser(schemaFields._id, userId);
          if (role !== Role.admin) {
              const err: any = new Error(Message.NoPermission());
              err.statusCode = ApiStatusCode.Forbidden;
              return next(err)
          };
          const result = await DoctorService.getAll();
          const response = result.map(e => {
            return {
              ...e.userId,
              department: e.department
            }
          })
          res.status(ApiStatusCode.OK).json({
              status: ApiStatus.succes,
              data: response
          });
      } catch (error) {
          next(error);
      }
  }
}