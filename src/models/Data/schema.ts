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
    done
}

export enum DepartmentType {
    khamBenh,
    noiTongHop,
    ngoai,
    canLamSang,
    san,
    daLieu,
    dongY,
    truyenNhiem,
    duoc,
    nhi,
    thanNhanTao
}