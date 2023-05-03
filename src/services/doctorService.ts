import { ICreateDoctor } from "../models/Data/objModel"
import Doctor from "../models/Schema/Doctor"

export default class DoctorService {
    public static createDoctor = async (obj: ICreateDoctor) => {
        return await Doctor.create(obj)
    }
    public static findOneByUserId = async (id) => {
        return await Doctor.findOne({ userId: id})
    } 
}