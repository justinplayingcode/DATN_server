import { IValidateReqBody } from "../models/Security";
import { schemaFields } from "./constant";
import { ApiStatusCode } from "./enum";

const validate = (req, requiredFields: string[]): IValidateReqBody => {
    const missingFields = [];
    requiredFields.forEach((field) => {
        if (!(field in req.body)) {
            missingFields.push(field);
        }
    });
    const result: IValidateReqBody = {
        pass: true
    }
    if (missingFields.length > 0) {
        result.pass = false;
        result.message = `Missing required field(s): ${missingFields.join(', ')}`;
    }
    return result
};

const validateReqBody = (req, requiredFields: string[], next) => {
    const verifyReqBody = validate(req, requiredFields)
    if(!verifyReqBody.pass) {
        const err: any = new Error(verifyReqBody.message);
        err.statusCode = ApiStatusCode.BadRequest;
        return next(err)
    }
}

export default validateReqBody

export class ReqBody {

    // auth
    public static login = [
        schemaFields.username, 
        schemaFields.password
    ];
    
    public static newAccessToken = [
        schemaFields.refreshToken, 
        schemaFields.username
    ];

    public static registerAdmin = [
        schemaFields.fullname, 
        schemaFields.email, 
        schemaFields.phonenumber, 
        schemaFields.dateOfBirth,
        schemaFields.address,
        schemaFields.gender,
        schemaFields.identification,
    ];

    //account
    public static registerDoctor = [
        schemaFields.fullname,
        schemaFields.email,
        schemaFields.phonenumber,
        schemaFields.gender,
        schemaFields.departmentId,
        schemaFields.address,
        schemaFields.dateOfBirth,
        schemaFields.identification,
        schemaFields.rank,
        schemaFields.position
    ];

    // table view
    public static getTableValues = [
      schemaFields.page,
      schemaFields.pageSize,
      schemaFields.tableType,
      schemaFields.searchKey
    ]

    // ======
    public static editInfomationUser = [
      schemaFields.email,
      schemaFields.fullname,
      schemaFields.phonenumber,
      schemaFields.gender,
      schemaFields.dateOfBirth,
      schemaFields.address,
      schemaFields.identification
    ]

    // doctor
    // patient
    public static registerPatient = [
        schemaFields.userId,
        schemaFields.fullname,
        schemaFields.email,
        schemaFields.phonenumber,
        schemaFields.gender,
        schemaFields.departmentId,
        schemaFields.address,
        schemaFields.dateOfBirth,
        schemaFields.identification,
        schemaFields.insurance,
        schemaFields.initialSymptom,
        schemaFields.typeAppointment
    ]

    public static searchPatientByInsurance = [
        schemaFields.insurance
    ]

    public static getPatientByUserId = [
        schemaFields.userId
    ]

    // department
    public static newDepartment = [
        schemaFields.departmentName,
        schemaFields.departmentCode
    ]

    //medication
    public static createMedication = [
      schemaFields.name,
      schemaFields.designation,
      schemaFields.usage,
      schemaFields.price
    ]

    public static editMedication = [
      schemaFields.id,
      schemaFields.name,
      schemaFields.designation,
      schemaFields.usage,
      schemaFields.price
    ]

    //díeases
    public static createDisases = [
      schemaFields.diseasesCode,
      schemaFields.diseasesName,
      schemaFields.symptom,
      schemaFields.prevention,
      schemaFields.departmentId
    ]

    public static editDisases = [
      schemaFields.id,
      schemaFields.diseasesCode,
      schemaFields.diseasesName,
      schemaFields.symptom,
      schemaFields.prevention,
      schemaFields.departmentId
    ]

    // schedule
    public static changeStatusToProcess = [
      schemaFields.id
    ]
    
    public static patientRequestMedical = [
      schemaFields.doctorId,
      schemaFields.departmentId,
      schemaFields.appointmentDate,
      schemaFields.initialSymptom
    ]
}