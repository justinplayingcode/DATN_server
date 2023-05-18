export default class Convert {
    public static enumToArray = (ob) => {
        return Object.keys(ob).filter((key) => isNaN(Number(key))).map((key) => ob[key]);
    }

    public static formattedDate = (date : Date): string => {
        const yyyy = date.getFullYear();
        const mm = date.getMonth() + 1; // Months start at 0!
        const dd = date.getDate();
        const day = dd < 10 ? '0' + dd.toString() : dd.toString();
        const month = mm < 10 ? '0' + mm.toString() : mm.toString()
        const formatted = day + '/' + month + '/' + yyyy;
        return formatted
    }

    public static vietnameseUnsigned = (str: string) => {
        str = str.replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, "A");
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, "E");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/I|Í|Ì|Ĩ|Ị/g, "I");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, "O");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, "U");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, "Y");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/Đ/g, "D");
        str = str.replace(/đ/g, "d");
        // Some system encode vietnamese combining accent as individual utf-8 characters
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng 
        str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
        return str;
    }

    public static generateUsername = (str: string, dob: string, database: string[]): string => {
        const unsignedArr = Convert.vietnameseUnsigned(str).split(' '); 
        const lastName = unsignedArr.pop();
        const firstName = unsignedArr.shift();
        let subName = '';
        if (unsignedArr.length > 0) {
            subName = unsignedArr.shift();
        };
        const [ month, date, year ] = dob.split('/');
        const yy = year.slice(-2);
        const tempMonth = parseInt(month);
        const day = parseInt(date);
        const dd = day < 10 ? '0' + day.toString() : day.toString();
        const mm = tempMonth < 10 ? '0' + tempMonth.toString() : tempMonth.toString();

        let result = `${lastName.toLowerCase()}.${firstName[0].toLowerCase()}${subName && subName[0].toLowerCase()}${dd}${mm}${yy}`;
        if (!database.includes(result)) {
            return result;
        }
        let suffix = 'a';
        while (database.includes(`${result}${suffix}`)) {
          suffix = String.fromCharCode(suffix.charCodeAt(0) + 1); // Chuyển sang ký tự tiếp theo trong bảng mã ASCII
        }
        return `${result}${suffix}`;
    }

    public static generatePassword = (str: string) => {
        const unsignedArr = Convert.vietnameseUnsigned(str).replace(/\s/g, "").toLowerCase();
        return unsignedArr;
    }
}
