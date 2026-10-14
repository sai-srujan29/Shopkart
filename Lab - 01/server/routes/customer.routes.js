import express from 'express'
import { registerCustomer , loginCustomer, getUser, logoutCustomer} from '../controllers/customer.controller.js'
import { isAuthenticated } from '../middlewares/authMiddlewares.js'

const CustomerRoutes = express.Router()

CustomerRoutes.post('/register', registerCustomer)
CustomerRoutes.post('/login', loginCustomer)
CustomerRoutes.get('/me', isAuthenticated, getUser)
CustomerRoutes.post('/logout', logoutCustomer)

export default CustomerRoutes  