export default class Message {
    public static invalidUserName = (value) => {
        return `${value} không phải là tên người dùng hợp lệ. Tên người dùng chỉ chứa các chữ cái và số!`
    };
    public static invalidEmail = (value) => {
        return `${value} không phải là email hợp lệ!`
    };
    public static invalidPhoneNumber = (value) => {
        return `${value}không phải là số điện thoại hợp lệ!`
    };
    public static invalidFullname = (value) => {
        return `${value} is not a valid name!`
    };
    public static invalidIdentification = (value) => {
        return `${value} is not a citizen identification!`
    };
    public static invalidInsurance = (value) => {
        return `${value} is not a medical insurance!`
    };
    public static NoPermission = () => {
        return "Your account don't have permission"
    };
    public static invalidDateOfBirth = `DateOfBirth is invalid, not match MM/DD/YYYY`
  
}

