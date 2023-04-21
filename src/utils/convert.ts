export const convertEnumToArray = (ob) => {
    return Object.keys(ob).filter((key) => isNaN(Number(key))).map((key) => ob[key]);
}