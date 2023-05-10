import moment from 'moment-timezone';

export default class MomentTimezone {
  public static convertDDMMYYY = (date: Date): string => {
    return moment(date).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY');
  }
}

