export default class Message {
    public static invalidUserName = (value) => {
        return `${value} is not a valid username. Username contains only letters and numbers!`
    };
    public static invalidEmail = (value) => {
        return `${value} is not a valid email!`
    };
    public static invalidPhoneNumber = (value) => {
        return `${value} is not a valid phone number!`
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
}

