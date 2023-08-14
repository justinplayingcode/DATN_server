import mongoose, { ClientSession } from "mongoose";
import AppointmentSchedule from "../schema/AppointmentSchedule";
import { DepartmentType, ScheduleRequestStatus, StatusAppointment, TypeAppointmentSchedule } from "../utils/enum";
import { ICreateAppointmentSchedule, ICreateAppointmentScheduleWhenRegister } from "../models/AppointmentSchedule";
import { TableResponseNoData, schemaFields } from "../utils/constant";
import MomentTimezone from "../helpers/timezone";
import DoctorService from "./doctorService";

export default class appointmentScheduleService {
  public static createWhenRegister = async (patientId, initialSymptom, typeAppointment, departmentId, session: ClientSession) => {
    try {
      const obj: ICreateAppointmentScheduleWhenRegister = {
        patientId,
        appointmentDate: new Date,
        approve: ScheduleRequestStatus.accpect,
        typeAppointment,
        initialSymptom,
        statusAppointment: StatusAppointment.wait,
        departmentId
      };
      const appointmentSchedule = new AppointmentSchedule(obj);
      return appointmentSchedule.save({ session });
    } catch (error) {
      throw error
    }
  }

  public static findOneWithId = async (id) => {
    return await AppointmentSchedule.findById(id).lean()
  }

  public static createWhenRegisterPatientIn = async (patientId, doctorId, initialSymptom, departmentId, appointmentDate: Date, session: ClientSession) => {
    try {
      const obj: ICreateAppointmentSchedule = {
        doctorId,
        patientId,
        appointmentDate,
        approve: ScheduleRequestStatus.accpect,
        typeAppointment: TypeAppointmentSchedule.khamTheoChiDinh,
        initialSymptom,
        statusAppointment: StatusAppointment.wait,
        departmentId
      };
      const appointmentSchedule = new AppointmentSchedule(obj);
      return appointmentSchedule.save({ session });
    } catch (error) {
      throw error
    }
  }

  public static createWithRequestMedical = async (patientId, doctorId, departmentId, appointmentDate: Date, initialSymptom: string, session: ClientSession) => {
    try {
      const obj: ICreateAppointmentSchedule = {
        doctorId,
        patientId,
        appointmentDate,
        approve: ScheduleRequestStatus.wait,
        typeAppointment: TypeAppointmentSchedule.khamTheoYeuCau,
        initialSymptom,
        statusAppointment: StatusAppointment.wait,
        departmentId
      };
      const appointments = await AppointmentSchedule.create([obj], {session} );
      return appointments[0];
    } catch (error) {
      throw error
    }
  }

  // cần viết thêm logic trả ra các kết quả xét nghiệm
  public static getSchedulesNormal = async (page: number, pageSize: number, searchKey: string, userId) => {
    const { departmentId } = await DoctorService.findDepartmentOfDoctor(userId) as any;
    if(departmentId.departmentCode === DepartmentType.canLamSang) {
      return TableResponseNoData;
    } else {
      const department = departmentId.departmentCode === DepartmentType.tiepDon ? undefined : departmentId.departmentCode;
      const values = (await AppointmentSchedule
        .find(department ? { doctorId: { $exists: false }, departmentId: departmentId._id, statusAppointment: StatusAppointment.wait } : { doctorId: { $exists: false }, statusAppointment: StatusAppointment.wait }, { __v: 0 })
        .sort({ statusUpdateTime: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .populate({
          path: schemaFields.patientId,
          select: `-__v`,
          populate: {
            path: schemaFields.userId,
            select: `${schemaFields.fullname} ${schemaFields.email} ${schemaFields.phonenumber} ${schemaFields.address} ${schemaFields.dateOfBirth} ${schemaFields.gender} ${schemaFields._id} ${schemaFields.identification}`,
            match: {
              fullname: { $regex: new RegExp(searchKey, 'i') }
            }
          }
        })
        .populate({
          path: schemaFields.departmentId,
          select: `${schemaFields.departmentName} -${schemaFields._id}`
        })
        .select(`-${schemaFields.statusUpdateTime} -${schemaFields.approve}`)
        .lean())?.reduce((acc, cur) => {
          const { patientId, departmentId, appointmentDate, ...other } = cur;
          if (departmentId && patientId) {
            const { departmentName } = departmentId as any;
            const { _id, userId, insurance } = patientId as any;
            if (userId) {
              const { _id: userid, dateOfBirth, ...infoUser } = userId as any;
              acc.push({
                ...other,
                appointmentDate: MomentTimezone.convertDDMMYYY(appointmentDate),
                userId: userid,
                ...infoUser,
                dateOfBirth: MomentTimezone.convertDDMMYYY(dateOfBirth),
                patientId: _id,
                insurance,
                departmentName
              });
            }
          }
          return acc;
        }, []) 
  
        const total = (await AppointmentSchedule
          .find({ doctorId: { $exists: false } }, { __v: 0 })
          .populate({
            path: schemaFields.patientId,
            select: `-__v`,
            populate: {
              path: schemaFields.userId,
              match: {
                fullname: { $regex: new RegExp(searchKey, 'i') }
              }
            }
          })
          .lean()).reduce((acc, cur) => {
            const { userId } = cur.patientId as any;
            if (userId) {
              acc.push(cur);
            }
            return acc;
          }, [])
        
      return {
        values,
        total: total.length,
      }
    }
  }

  public static getSchedulesParaclinical = async (page: number, pageSize: number, searchKey: string, userId) => {
    const { departmentId, _id: doctorId } = await DoctorService.getInforByUserId(userId) as any;

    if(departmentId.departmentCode === DepartmentType.tiepDon) {
      return TableResponseNoData;
    } else {
      const department = departmentId.departmentCode === DepartmentType.canLamSang ? undefined : departmentId.departmentCode;
      const values = (await AppointmentSchedule
        .find(department ? { doctorId: doctorId, departmentId: departmentId._id, statusAppointment: StatusAppointment.testing, typeAppointment: { $in: [TypeAppointmentSchedule.khamTheoBHYT, TypeAppointmentSchedule.khamThuong]} } : { statusAppointment: StatusAppointment.testing }, { __v: 0 })
        .sort({ statusUpdateTime: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .populate({
          path: schemaFields.patientId,
          select: `-__v`,
          populate: {
            path: schemaFields.userId,
            select: `${schemaFields.fullname} ${schemaFields.email} ${schemaFields.phonenumber} ${schemaFields.address} ${schemaFields.dateOfBirth} ${schemaFields.gender} ${schemaFields._id} ${schemaFields.identification}`,
            match: {
              fullname: { $regex: new RegExp(searchKey, 'i') }
            }
          }
        })
        .populate({
          path: schemaFields.departmentId,
          select: `${schemaFields.departmentName} -${schemaFields._id}`
        })
        .select(`-${schemaFields.statusUpdateTime} -${schemaFields.approve}`)
        .lean())?.reduce((acc, cur) => {
          const { patientId, departmentId, appointmentDate, ...other } = cur;
          if (departmentId && patientId) {
            const { departmentName } = departmentId as any;
            const { _id, userId, insurance } = patientId as any;
            if (userId) {
              const { _id: userid, dateOfBirth, ...infoUser } = userId as any;
              acc.push({
                ...other,
                appointmentDate: MomentTimezone.convertDDMMYYY(appointmentDate),
                userId: userid,
                ...infoUser,
                dateOfBirth: MomentTimezone.convertDDMMYYY(dateOfBirth),
                patientId: _id,
                insurance,
                departmentName
              });
            }
          }
          return acc;
        }, []) 
  
        const total = (await AppointmentSchedule
          // .find({ doctorId: { $exists: false } }, { __v: 0 })
          .find(department ? { departmentId: departmentId._id, statusAppointment: { $in: [StatusAppointment.testing, StatusAppointment.wait] } } : { statusAppointment: StatusAppointment.testing }, { __v: 0 })
          .populate({
            path: schemaFields.patientId,
            select: `-__v`,
            populate: {
              path: schemaFields.userId,
              match: {
                fullname: { $regex: new RegExp(searchKey, 'i') }
              }
            }
          })
          .lean()).reduce((acc, cur) => {
            const { userId } = cur.patientId as any;
            if (userId) {
              acc.push(cur);
            }
            return acc;
          }, [])
        
      return {
        values,
        total: total.length,
      }
    }
  }

  public static getSchedulesDoneParaclinical = async (page: number, pageSize: number, searchKey: string, userId) => {
    const { departmentId, _id: doctorId } = await DoctorService.getInforByUserId(userId) as any;

    if(departmentId.departmentCode === DepartmentType.tiepDon || departmentId.departmentCode === DepartmentType.canLamSang) {
      return TableResponseNoData;
    } else {
      const values = (await AppointmentSchedule
        .find({ doctorId: doctorId, departmentId: departmentId._id, statusAppointment: StatusAppointment.wait, typeAppointment: { $in: [TypeAppointmentSchedule.khamTheoBHYT, TypeAppointmentSchedule.khamThuong]} }, { __v: 0 })
        .sort({ statusUpdateTime: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .populate({
          path: schemaFields.patientId,
          select: `-__v`,
          populate: {
            path: schemaFields.userId,
            select: `${schemaFields.fullname} ${schemaFields.email} ${schemaFields.phonenumber} ${schemaFields.address} ${schemaFields.dateOfBirth} ${schemaFields.gender} ${schemaFields._id} ${schemaFields.identification}`,
            match: {
              fullname: { $regex: new RegExp(searchKey, 'i') }
            }
          }
        })
        .populate({
          path: schemaFields.departmentId,
          select: `${schemaFields.departmentName} -${schemaFields._id}`
        })
        .select(`-${schemaFields.statusUpdateTime} -${schemaFields.approve}`)
        .lean())?.reduce((acc, cur) => {
          const { patientId, departmentId, appointmentDate, ...other } = cur;
          if (departmentId && patientId) {
            const { departmentName } = departmentId as any;
            const { _id, userId, insurance } = patientId as any;
            if (userId) {
              const { _id: userid, dateOfBirth, ...infoUser } = userId as any;
              acc.push({
                ...other,
                appointmentDate: MomentTimezone.convertDDMMYYY(appointmentDate),
                userId: userid,
                ...infoUser,
                dateOfBirth: MomentTimezone.convertDDMMYYY(dateOfBirth),
                patientId: _id,
                insurance,
                departmentName
              });
            }
          }
          return acc;
        }, []) 
  
        const total = (await AppointmentSchedule
          .find({ departmentId: departmentId._id, statusAppointment: { $in: [StatusAppointment.testing, StatusAppointment.wait] } }, { __v: 0 })
          .populate({
            path: schemaFields.patientId,
            select: `-__v`,
            populate: {
              path: schemaFields.userId,
              match: {
                fullname: { $regex: new RegExp(searchKey, 'i') }
              }
            }
          })
          .lean()).reduce((acc, cur) => {
            const { userId } = cur.patientId as any;
            if (userId) {
              acc.push(cur);
            }
            return acc;
          }, [])
        
      return {
        values,
        total: total.length,
      }
    }
  }

  public static getAllScheduleRequest = async (page: number, pageSize: number, searchKey: string, doctorId, approve: ScheduleRequestStatus) => {
    const currentDate = new Date();
    currentDate.setHours( 0, 0, 0, 0);
    const values = (await AppointmentSchedule
      .find( { doctorId, approve, statusAppointment: StatusAppointment.wait, appointmentDate: { $gte: currentDate } } )
      .sort({ statusUpdateTime: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate({
        path: schemaFields.patientId,
        select: `-__v`,
        populate: {
          path: schemaFields.userId,
          select: `${schemaFields.fullname} ${schemaFields.email} ${schemaFields.phonenumber} ${schemaFields.address} ${schemaFields.dateOfBirth} ${schemaFields.gender} ${schemaFields._id} ${schemaFields.identification}`,
          match: {
            fullname: { $regex: new RegExp(searchKey, 'i') }
          }
        }
      })
      .populate({
        path: schemaFields.departmentId,
        select: `${schemaFields.departmentName} -${schemaFields._id}`
      })
      .select(`-${schemaFields.statusUpdateTime} -${schemaFields.approve}`)
      .lean())?.reduce((acc, cur) => {
        const { patientId, departmentId, appointmentDate, ...other } = cur;
          if (departmentId && patientId) {
            const { departmentName } = departmentId as any;
            const { _id, userId, insurance } = patientId as any;
            if (userId) {
              const { _id: userid, dateOfBirth, ...infoUser } = userId as any;
              acc.push({
                ...other,
                appointmentDate: MomentTimezone.convertDDMMYYY(appointmentDate),
                userId: userid,
                ...infoUser,
                dateOfBirth: MomentTimezone.convertDDMMYYY(dateOfBirth),
                patientId: _id,
                insurance,
                departmentName
              });
            }
          }
          return acc;
      }, []);

      const total = (await AppointmentSchedule
        .find( { doctorId, approve, statusAppointment: StatusAppointment.wait, appointmentDate: { $gte: currentDate } } )
        .populate({
          path: schemaFields.patientId,
          select: `-__v`,
          populate: {
            path: schemaFields.userId,
            match: {
              fullname: { $regex: new RegExp(searchKey, 'i') }
            }
          }
        }).lean())?.reduce((acc, cur) => {
          const { userId } = cur.patientId as any;
          if (userId) {
            acc.push(cur);
          }
          return acc;
        }, []);

      return {
        values,
        total: total.length,
      }
  }

  public static approveScheduleRequest = async (id, approve, session) => {
    if(approve) {
      return await AppointmentSchedule.findByIdAndUpdate(id, { approve: ScheduleRequestStatus.accpect }, { new: true, runValidators: true, session})
    } else {
      return await AppointmentSchedule.findByIdAndUpdate(id, { approve: ScheduleRequestStatus.reject }, { new: true, runValidators: true, session})
    }
  }

  public static patientGetListRequestMedical = async (page: number, pageSize: number, searchKey: string, patientId) => {
    const currentDate = new Date();
    currentDate.setHours( 0, 0, 0, 0);
    const values = (await AppointmentSchedule
      .find({ patientId, appointmentDate: { $gte: currentDate } , statusAppointment: ScheduleRequestStatus.wait} )
      .sort({ statusUpdateTime: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate({
        path: schemaFields.departmentId,
        select: `${schemaFields.departmentName} -${schemaFields._id}`
      })
      .populate({
        path: schemaFields.doctorId,
        select: `-__v`,
        populate: {
          path: schemaFields.userId,
          select: `${schemaFields.fullname} ${schemaFields.email} ${schemaFields.phonenumber} ${schemaFields.address} ${schemaFields.dateOfBirth} ${schemaFields.gender} ${schemaFields._id} ${schemaFields.identification}`,
          match: {
            fullname: { $regex: new RegExp(searchKey, 'i') }
          }
        }
      })
      .select(`-${schemaFields.statusUpdateTime}`)
      .lean())?.reduce((acc, cur) => {
        const { doctorId, departmentId, appointmentDate, statusAppointment, approve, ...other } = cur;
        if (departmentId && doctorId) {
          const { departmentName } = departmentId as any;
          const { _id, userId, rank, position } = doctorId as any;
          if (userId) {
            const { fullname } = userId as any;
            acc.push({
              ...other,
              appointmentDate: MomentTimezone.convertDDMMYYY(appointmentDate),
              doctorName: fullname,
              departmentName,
              doctorId: _id,
              doctorRank: rank,
              doctorPosition: position,
              status: approve
            })
          }
        }

        return acc;
      }, [])

      const total = (await AppointmentSchedule
        .find({ patientId, appointmentDate: { $gte: currentDate }})
        .populate({
          path: schemaFields.doctorId,
          select: `-__v`,
          populate: {
            path: schemaFields.userId,
            match: {
              fullname: { $regex: new RegExp(searchKey, 'i') }
            }
          }
        }).lean())?.reduce((acc, cur) => {
          const { userId } = cur.patientId as any;
          if (userId) {
            acc.push(cur);
          }
          return acc;
        }, []);

      return {
        values,
        total: total.length,
      }
  }

  public static doctorGetAllRequestMedical = async (page: number, pageSize: number, searchKey: string, doctorId) => {
    const currentDate = new Date();
    currentDate.setHours( 0, 0, 0, 0);
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 1);

    const values = (await AppointmentSchedule
      .find({ doctorId, approve: ScheduleRequestStatus.accpect, statusAppointment: StatusAppointment.wait, appointmentDate: { $gte: currentDate, $lt: nextDate } })
      .sort({ statusUpdateTime: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate({
        path: schemaFields.patientId,
        select: `-__v`,
        populate: {
          path: schemaFields.userId,
          select: `${schemaFields.fullname} ${schemaFields.email} ${schemaFields.phonenumber} ${schemaFields.address} ${schemaFields.dateOfBirth} ${schemaFields.gender} ${schemaFields._id} ${schemaFields.identification}`,
          match: {
            fullname: { $regex: new RegExp(searchKey, 'i') }
          }
        }
      })
      .select(`-${schemaFields.statusUpdateTime} -${schemaFields.approve} -${schemaFields.departmentId}`)
      .lean()).reduce((acc, cur) => {
        const { patientId, appointmentDate, ...other } = cur;
          if (patientId) {
            const { _id, userId, insurance } = patientId as any;
            if (userId) {
              const { _id: userid, dateOfBirth, ...infoUser } = userId as any;
              acc.push({
                ...other,
                appointmentDate: MomentTimezone.convertDDMMYYY(appointmentDate),
                userId: userid,
                ...infoUser,
                dateOfBirth: MomentTimezone.convertDDMMYYY(dateOfBirth),
                patientId: _id,
                insurance,
              });
            }
          }
          return acc;
      }, []);

      const total = (await AppointmentSchedule
        .find({ doctorId, approve: ScheduleRequestStatus.accpect, statusAppointment: StatusAppointment.wait, appointmentDate: { $gte: currentDate, $lt: nextDate } })
        .populate({
          path: schemaFields.patientId,
          select: `-__v`,
          populate: {
            path: schemaFields.userId,
            match: {
              fullname: { $regex: new RegExp(searchKey, 'i') }
            }
          }
        }).lean())?.reduce((acc, cur) => {
          const { userId } = cur.patientId as any;
          if (userId) {
            acc.push(cur);
          }
          return acc;
        }, []);

      return {
        values,
        total: total.length
      }
  }

  public static changeStatusToProcess = async (id, doctorId, session) => {
    try {
      const obj = {
        doctorId,
        statusAppointment: StatusAppointment.process,
        statusUpdateTime: new Date
      }
      await AppointmentSchedule.findByIdAndUpdate(id, obj, {runValidators: true, session});
    } catch (error) {
      throw error;
    }
  }

  public static changeStatusToTesting = async (id, obj, session) => {
    try {
      const update = {
        statusAppointment: StatusAppointment.testing,
        statusUpdateTime: new Date,
        ...obj
      }
      await AppointmentSchedule.findByIdAndUpdate(id, update, {runValidators: true, session});
    } catch (error) {
      throw error;
    }
  }

  public static changeStatusTestingToProcess = async (id, session) => {
    try {
      const obj = {
        statusAppointment: StatusAppointment.process,
        statusUpdateTime: new Date
      }
      await AppointmentSchedule.findByIdAndUpdate(id, obj, {runValidators: true, session});
    } catch (error) {
      throw error;
    }
  }

  public static changeStatusToProcessBeforeTesting = async (id, session) => {
    try {
      const obj = {
        statusAppointment: StatusAppointment.process,
        statusUpdateTime: new Date
      }
      await AppointmentSchedule.findByIdAndUpdate(id, obj, {runValidators: true, session});
    } catch (error) {
      throw error;
    }
  }

  public static changeStatusToWaitAfterTesting = async (id, session) => {
    try {
      const obj = {
        statusAppointment: StatusAppointment.wait,
        statusUpdateTime: new Date
      }
      await AppointmentSchedule.findByIdAndUpdate(id, obj, {runValidators: true, session});
    } catch (error) {
      throw error;
    }
  }

  public static changeStatusToDone = async (id, session) => {
    try {
      const obj = {
        statusAppointment: StatusAppointment.done,
        statusUpdateTime: new Date
      }
      return await AppointmentSchedule.findByIdAndUpdate(id, obj, {new: true, runValidators: true, session});
    } catch (error) {
      throw error;
    }
  }

  public static getScheduleNearestOfPatient = async (patientId) => {
    const schedule = (await AppointmentSchedule
      .find({patientId, statusAppointment: StatusAppointment.done, approve: ScheduleRequestStatus.accpect})
      .sort({ statusUpdateTime: -1 })
      .limit(5)
      .select(`-__v -${schemaFields.statusUpdateTime} -${schemaFields.approve}`)
      .lean())?.reduce((acc, cur) => {
        const { appointmentDate, _id, typeAppointment } = cur;
        acc.push({
          appointmentDate: MomentTimezone.convertDDMMYYY(appointmentDate),
          id: _id,
          typeAppointment
        })
        return acc;
      }, [])
      return schedule
  }

  public static getCountInLast7Day = async () => {
    try {
      const today = MomentTimezone.convertDate(new Date());
      const lastSevenDays = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const result = await AppointmentSchedule.aggregate([
        {
          $match: {
            appointmentDate: { $gte: lastSevenDays, $lte: today },
            approve: ScheduleRequestStatus.accpect,
            statusAppointment: StatusAppointment.done
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$appointmentDate' },
              month: { $month: '$appointmentDate' },
              day: { $dayOfMonth: '$appointmentDate' },
            },
            appointmentCount: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            date: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: {
                  $dateFromParts: {
                    year: '$_id.year',
                    month: '$_id.month',
                    day: '$_id.day',
                  },
                },
              },
            },
            appointmentCount: 1,
          },
        },
        {
          $sort: { date: -1 } 
        }
      ])
      const dates = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
        dates.push(date.toISOString().slice(0, 10));
      }
      const results = dates.map((date) => {
        const stat = result.find((item) => item.date === date);
        return {
          date: date,
          appointmentCount: stat ? stat.appointmentCount : 0,
        };
      });
      return results;
    } catch (error) {
      throw error
    }
  }

  public static getCountInLast7DayForDoctor = async (departmentId) => {
    try {
      const today = new Date();
      const lastSevenDays = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const result = await AppointmentSchedule.aggregate([
        {
          $match: {
            appointmentDate: { $gte: lastSevenDays, $lte: today },
            approve: ScheduleRequestStatus.accpect,
            statusAppointment: StatusAppointment.done,
            departmentId: new mongoose.Types.ObjectId(departmentId)
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$appointmentDate' },
              month: { $month: '$appointmentDate' },
              day: { $dayOfMonth: '$appointmentDate' },
            },
            appointmentCount: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            date: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: {
                  $dateFromParts: {
                    year: '$_id.year',
                    month: '$_id.month',
                    day: '$_id.day',
                  },
                },
              },
            },
            appointmentCount: 1,
          },
        },
      ])
      const dates = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
        dates.push(date.toISOString().slice(0, 10));
      }
      const results = dates.map((date) => {
        const stat = result.find((item) => item.date === date);
        return {
          date: date,
          appointmentCount: stat ? stat.appointmentCount : 0,
        };
      });
      return results;
    } catch (error) {
      throw error
    }
  }

  public static getDataNotificationForDoctor = async (doctorId) => {
    const currentDate = new Date();
    currentDate.setHours( 0, 0, 0, 0);
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 1);
    const requestCount = await AppointmentSchedule
      .find({doctorId, approve: ScheduleRequestStatus.wait, statusAppointment: StatusAppointment.wait, appointmentDate: { $gte: currentDate }})
      .lean().count();
    const scheduleCount = await AppointmentSchedule
      .find({ doctorId, approve: ScheduleRequestStatus.accpect, statusAppointment: StatusAppointment.wait, appointmentDate: { $gte: currentDate, $lt: nextDate } })
      .lean().count();
    return {
      requestCount,
      scheduleCount
    }
  }

  public static getDataNotificationForPatient = async (patientId) => {
    const currentDate = new Date();
    currentDate.setHours( 0, 0, 0, 0);
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 1);
    const scheduleCount = await AppointmentSchedule
      .find({ patientId, approve: ScheduleRequestStatus.accpect, statusAppointment: StatusAppointment.wait, appointmentDate: { $gte: currentDate, $lt: nextDate } })
      .lean().count();
    return {
      scheduleCount
    }
  }

}