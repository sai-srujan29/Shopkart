import CustomerModel from "../models/customer.model.js"
import bcrypt from 'bcrypt'
import genToken from "../utils/generateToken.js"

const cookieOptions = {
    httpOnly : true
}

export const registerCustomer = async (req, res) => {
    try {

        const {fullName, email, password, phone} = req.body


        if (!fullName || !email || !password || !phone) {
            return res.status(400).json({ message: 'All fileds are Required' })
        }


        const emailExists = await CustomerModel.findOne({email})

        if(emailExists) {
            return res.status(409).json({message : 'User already exists'})
        }

        if(password.length < 6) {
            return res.status(400).json({message : 'Password must contain at least 6 characters.'})
        }
 
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newCustomer = await CustomerModel.create({
            fullName,
            email,
            password : hashedPassword,
            phone
        })

        const token = genToken(newCustomer._id)
        res.cookie('token', token, cookieOptions)

        res.status(201).json({success: true, message : 'Customer registered Successfully', customer: newCustomer})

    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: error.message || 'Server error occurred during registration', error: error.message });
    }   

}

export const loginCustomer = async(req , res) => {
    try {
        const {email , password} = req.body

        if(!email || !password) {
            return res.status(400).json({ message: 'All fileds Required' })
        }

        const user = await CustomerModel.findOne({email})

        if(!user) {
            return res.status(401).json({ message: 'Invalid Credentials' })
        }

        const MatchedPassword = await bcrypt.compare(password , user.password)

        if(!MatchedPassword) {
            return res.status(401).json({ message: 'Invalid Credentials' })
        }
         const token = genToken(user._id)
        res.cookie('token', token, cookieOptions) 

        res.status(200).json({ message: 'User Logged In' })

    }
    catch(error) {
        res.status(500).json({ message: 'Server crashed', error: error.message })
    }
}

export const getUser = (req, res) => {
    const authenticatedUser = req.user 
    res.status(200).json({authenticatedUser}) 
}

export const logoutCustomer = async(req, res) => {
    res.clearCookie('token')
    res.status(200).json({"success": true, "message": "Logged out successfully"})
}

