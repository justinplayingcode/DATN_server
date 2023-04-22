import { schemaFields } from "./schema";

export default class ReqBody {
    public static registerAdmin = [schemaFields.username, schemaFields.email, schemaFields.password, schemaFields.role, schemaFields.avatar];

    public static login = [schemaFields.username, schemaFields.password];
    
    public static newAccessToken = [schemaFields.refreshToken, schemaFields.username]
}