import jwt from 'jsonwebtoken'
import CustomerModel from '../models/customer.model.js'

export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        const Verification = jwt.verify(token, process.env.jwt_secret);
        const user = await CustomerModel.findById(Verification.userId);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: 'Unauthorized: Invalid token', error: error.message });
    }
}