import { customTokenVerify, tokenVerify } from "../utils/util.js";

const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const isCustomAuth = token.length < 500;

        let decodedData;

        if (token && isCustomAuth) {
            decodedData = customTokenVerify(token);
            req.userId = decodedData?.id;
        } else {
            decodedData = tokenVerify(token);
            req.userId = decodedData?.sub;
        }

        next();

    } catch (error) {
        console.log(error);
    }
};

export default auth;