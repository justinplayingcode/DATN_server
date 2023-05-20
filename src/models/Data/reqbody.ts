import { schemaFields } from "./schema";

export default class ReqBody {


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

    public static registerDoctor = [
        schemaFields.fullname,
        schemaFields.email,
        schemaFields.phonenumber,
        schemaFields.gender,
        schemaFields.department,
        schemaFields.address,
        schemaFields.dateOfBirth,
        schemaFields.identification,
        schemaFields.rank,
        schemaFields.position
    ];

    // doctor

    // patient
    public static registerPatient = [
        schemaFields.userId,
        schemaFields.fullname,
        schemaFields.email,
        schemaFields.phonenumber,
        schemaFields.gender,
        schemaFields.department,
        schemaFields.address,
        schemaFields.dateOfBirth,
        schemaFields.identification,
        schemaFields.insurance
    ]

    public static searchPatientByInsurance = [
        schemaFields.insurance
    ]

    public static getPatientByUserId = [
        schemaFields.userId
    ]

    public static getAllPatientWait = [
        schemaFields.boarding,
        schemaFields.department
    ]

    // department
    public static newDepartment = [
        schemaFields.name,
        schemaFields.code
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
      schemaFields.code,
      schemaFields.name,
      schemaFields.symptom,
      schemaFields.prevention,
      schemaFields.department
    ]

    public static editDisases = [
      schemaFields.id,
      schemaFields.code,
      schemaFields.name,
      schemaFields.symptom,
      schemaFields.prevention,
      schemaFields.department
    ]
}