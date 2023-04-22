export default class Convert {
    public static enumToArray = (ob) => {
        return Object.keys(ob).filter((key) => isNaN(Number(key))).map((key) => ob[key]);
    }
}
