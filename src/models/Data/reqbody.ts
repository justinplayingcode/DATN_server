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
    public static newMedication = [
      schemaFields.name,
      schemaFields.designation,
      schemaFields.usage,
      schemaFields.price
    ]
}