import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const secret = process.env.SECRET_KEY;


export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

export const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
}


export const signToken = async (email, id) => {

    const options = { expiresIn: "1h" };
    
    const token = await jwt.sign({ email, id }, process.env.SECRET_KEY, options);

    return token;

};

export const customTokenVerify = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        return decoded;
    } catch (error) {
        console.log(error);
    }
}
export const tokenVerify = (token) => {
    try {
        const decoded = jwt.decode(token);
        return decoded;
    } catch (error) {
        console.log(error);
    }
}