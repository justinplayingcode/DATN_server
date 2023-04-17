export const validateUserName = (value) => {
    const regex = new RegExp('^[a-zA-Z0-9]+$');
    return regex.test(value);
}

export const validateEmail = (value) => {
    const regex = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$');
    return regex.test(value);
}