import jwt from "jsonwebtoken";

export const checkCurrentUser = (req, res, next) => {
    const Authorization = req.header('authorization');

    if (!Authorization) {
        req.user = null;
        next();
    } else {
        // get token from Authorization
        const token = Authorization.replace('Bearer ', "");

        // verify token
        try {
            const { userId } = jwt.verify(token, process.env.APP_SECRET) as any;
            req.user = { userId };
            next();
        } catch (err) {
            req.user = null;
            next();
        }
    }


}   