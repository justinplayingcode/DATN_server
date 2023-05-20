export const collectionName = {
    User: 'User',
    Doctor: 'Doctor',
    Patient: 'Patient',
    Department: 'Department',
    Histories: 'Histories',
    Diseases: 'Diseases',
    Medications: 'Medications',
    Security: 'Security',
    Health: 'Health',
    Test: "Test",
    Post: "Post"
}

export const schemaFields = {
    username: 'username',
    userId: 'userId',
    user: 'user',
    password: 'password',
    email: 'email',
    _id: '_id',
    id: 'id',
    role: 'role',
    avatar: 'avatar',
    gender: 'gender',
    phonenumber: 'phonenumber',
    address: 'address',
    speciality: 'speciality',
    dateOfBirth: 'dateOfBirth',
    insurance: 'insurance',
    identification: 'identification',
    hospitalization: 'hospitalization',
    doctorId: 'doctorId',
    patientId: 'patientId',
    date: 'date',
    diagnosis: 'diagnosis',
    hospitalizationCount: "hospitalizationCount",
    indications: 'indications',
    usage: 'usage',
    price: 'price',
    prescription: 'prescription',
    testsId: 'testsId',
    refreshToken: 'refreshToken',
    heartRate: 'heartRate',
    temperature: 'temperature',
    bloodPressure: 'bloodPressure',
    glucose: 'glucose',
    weight: 'weight',
    height: 'height',
    medicalHistory: 'medicalHistory',
    fullname: 'fullname',
    department: 'department',
    name: 'name',
    code: 'code',
    systolic: 'systolic',
    diastolic: 'diastolic',
    rank: 'rank',
    position: 'position',
    boarding: 'boarding',
    isProcessing: 'isProcessing',
    designation: 'designation',
    symptom: 'symptom',
    prevention: 'prevention'
}

export enum Role {
    doctor,
    patient,
    admin
}

export enum Gender {
    male,
    female
}

export enum statusAppointment {
    wait,
    process,
    testing,
    done
}

export enum DepartmentType {
    tiepDon = "BV00kkB00",
    noiTongHop = "BV00KTH02",
    ngoai = "BV00KN03",
    canLamSang = "BV00KCLS04",
    san = "BV00KS05",
    daLieu = "BV00KDL06",
    dongY = "BV00KDY07",
    truyenNhiem = "BV00KTN08",
    duoc = "BV00KD09",
    nhi = "BV00KN10",
    thanNhanTao = "BV00KTNT11"
}

export enum DoctorRank {
    thacSi,
    tienSi,
    PGSTS,
    GSTS,
    none
}

export enum Position {
    dean,
    viceDean,
    none
}