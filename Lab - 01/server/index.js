import express from 'express'
import mongoose from 'mongoose'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import CustomerRoutes from './routes/customer.routes.js'
import ProductRoutes from './routes/product.routes.js'
import WishlistRoutes from './routes/wishlist.routes.js'
import CartRoutes from './routes/cart.routes.js'
import OrderRoutes from './routes/order.routes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '.env') })

const app = express()
const port = process.env.PORT || 1974

mongoose.connect(process.env.dbUrl).then(() => {
    console.log("DB connected Successfully")
}).catch((err) => {  
    console.log(err)
})

app.use(express.json())
app.use(cookieParser())

app.use('/customers', CustomerRoutes)
app.use('/products', ProductRoutes)
app.use('/wishlist', WishlistRoutes)
app.use('/cart', CartRoutes)
app.use('/orders', OrderRoutes)

app.get('/', (req, res) => {
    res.send("Hello from the User")
})

app.listen(port, () => { 
    console.log(`Server Started at ${port}`)
})