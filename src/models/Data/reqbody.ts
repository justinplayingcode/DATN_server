import { schemaFields } from "./schema";

export default class ReqBody {
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
    ];

    public static registerDoctor = [
        schemaFields.fullname,
        schemaFields.email,
        schemaFields.phonenumber,
        schemaFields.gender,
        schemaFields.department,
        schemaFields.address,
        schemaFields.dateOfBirth
    ];

    public static registerPatient = [
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

    public static newDepartment = [
        schemaFields.name,
        schemaFields.code
    ]
}