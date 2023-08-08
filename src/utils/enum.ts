export enum ApiStatus {
  succes = 0,
  fail = 1
}

export enum ApiStatusCode {
  OK = 200,
  Created = 201,
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,
  Forbidden = 403,
  ServerError = 500,
}

export enum IsUploadFor {
  avatar,
  testResult
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

export enum StatusAppointment {
  wait,
  process,
  testing,
  done
}

export enum DepartmentType {
  tiepDon,
  noiTongHop,
  ngoai,
  canLamSang,
  san,
  daLieu,
  dongY,
  truyenNhiem,
  duoc,
  nhi,
  thanNhanTao,
  capCuu,
  rangHamMat,
  taiMuiHong,
  dinhDuong,
  mat
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

export enum Onboarding {
  none,
  inpatient,
  outpatient,
}

export enum TypeAppointmentSchedule {
  khamTheoYeuCau,
  khamThuong,
  khamTheoBHYT,
  khamTheoChiDinh,
}

export enum TypeTestService {
  sinhHoa,
  dongMau,
  huyetHoc,
  nuocTieu,
  sieuAm,
  dienTim,
  chupXQuang,
  chupCT
}

export enum TemplateType {
  template1,
  template2,
  template3,
}

export enum TableType {
  doctorAccount,
  patientAccount,
  medications,
  diseases,
  departments,
  doctorInDepartment,
  scheduleNormal,
  scheduleParaclinical,
  schedulePatientIn, //
  schedulePatientOut, //
  scheduleRequestWaitApprove,
  scheduleRequestApproved,
  scheduleRequestOfPatient,
  approveRequestMedical,
  historyMedicalOfPatient, //
  historyMedicalOfDoctor, //
  scheduleDoneParaclinical
}

export enum ScheduleRequestStatus {
  wait,
  accpect,
  reject
}

export enum exportCsvType {
  doctorAccount,
  patientAccount,
  patientIn,
  patientOut,
  historiesMedical,
  manageMedication,
  manageDisease,
  
}