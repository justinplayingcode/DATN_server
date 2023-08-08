import moment from 'moment-timezone';

export default class MomentTimezone {
  public static convertDDMMYYY = (date: Date): string => {
    return moment(date).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY');
  }
  public static convertDate = (date: Date): Date => {
    return moment(date).tz('Asia/Ho_Chi_Minh').toDate();
  }
  public static convertDDMMYYYCsv = (date: Date): string => {
    return moment(date).tz('Asia/Ho_Chi_Minh').format('DD-MM-YYYY');
  }
}

