import User from '../models/user.js';
import { hashPassword, comparePassword, signToken } from '../utils/util.js';

export const signin = async (req, res) => {
    const { email, password } = req.body;

    try {

        const existingUser = await User.findOne({ email });

        if (!existingUser) return res.status(400).json({ error: 'User does not exist' });

        const isMatch = await comparePassword(password, existingUser.password);

        if (!isMatch) return res.status(400).json({ error: 'Incorrect password' });

        const token = await signToken(email, existingUser._id);


        return res.status(200).json({ result: existingUser, token });

    } catch (error) {
        return res.status(500).json({ error: error });
    }
};

export const signup = async (req, res) => {

    const { email, password, confirmPassword, firstName, lastName } = req.body;
    try {

        const existingUser = await User.findOne({ email });

        if (existingUser) return res.status(400).json({ error: 'User already exists' });

        if (password !== confirmPassword) return res.status(400).json({ error: 'Passwords do not match' });

        const hashedPassword = await hashPassword(password);

        const newUser = await User.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` });

        const token = await signToken(newUser.email, newUser._id);

        return res.status(200).json({ result: newUser, token });

    } catch (error) {
        return res.status(500).json({ error: error });
    }

};
