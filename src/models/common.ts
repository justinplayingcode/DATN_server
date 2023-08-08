import { DoctorRank, Gender, Position, TypeAppointmentSchedule, TypeTestService } from "../utils/enum";

export const MappingTypeAppointmentSchedule = {
  [TypeAppointmentSchedule.khamTheoYeuCau]: 'Khám theo yêu cầu',
  [TypeAppointmentSchedule.khamThuong]: 'Khám thường',
  [TypeAppointmentSchedule.khamTheoBHYT]: 'Khám theo BHYT',
  [TypeAppointmentSchedule.khamTheoChiDinh]: 'Khám theo chỉ định',
}

export const MappingGender = {
  [Gender.male]: 'Nam',
  [Gender.female]: 'Nu',
}

export const MappingRank = {
  [DoctorRank.thacSi]: 'Thac Si',
  [DoctorRank.tienSi]: 'Tien Si',
  [DoctorRank.PGSTS]: 'Pho Giao Su, Tien Si',
  [DoctorRank.GSTS]: 'Giao Si, Tien Si',
  [DoctorRank.none]: 'Bac Si',
}

export const mappingDoctorPosition = {
  [Position.dean]: 'Truong Khoa',
  [Position.viceDean]: 'Pho Khoa',
  [Position.none]: 'Khong',
}

export const TestList = {
  [TypeTestService.sinhHoa]: "Xet nghiem sinh hoa",
  [TypeTestService.dongMau]: "Xet nghiem dong mau",
  [TypeTestService.huyetHoc]: "Xet nghiem mau",
  [TypeTestService.nuocTieu]: "Xet nghiem nuoc tieu",
  [TypeTestService.sieuAm]: "Sieu am",
  [TypeTestService.dienTim]: "Dien tam do (Dien tim)",
  [TypeTestService.chupXQuang]: "Chup X quang",
  [TypeTestService.chupCT]: "Chup cat lop vi tinh (CT)",
}


