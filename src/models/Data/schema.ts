export const collectionName = {
    User: 'User',
    Admin: 'Admin',
    Doctor: 'Doctor',
    Patient: 'Patient',
    Department: 'Department',
    History: 'History',
    Diseases: 'Diseases',
    Medications: 'Medications',

    // 
    Tests: "Tests",
    Posts: "Posts"
}

export const schemaFields = {
    username: 'username',
    password: 'password',
    _id: '_id',
    role: 'role',
    avatar: 'avatar',
    gender: 'gender',
    phonenumber: 'phonenumber',
    address: 'address',
    speciality: 'speciality',
    dateOfBirth: 'dateOfBirth',
    insurance: 'insurance',
    identification: 'identification',
    hospitalization: 'hospitalization'
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
    khamBenh = "BV00KKB01",
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