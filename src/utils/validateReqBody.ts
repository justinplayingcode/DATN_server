export const validateReqBody = (req, requiredFields: string[]): string => {
    const missingFields = [];

    requiredFields.forEach((field) => {
        if (!(field in req.body)) {
            missingFields.push(field);
        }
    });

    if (missingFields.length > 0) {
        return `Missing required field(s): ${missingFields.join(', ')}`;
    } else {
        return "";
    }
};