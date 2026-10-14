import Razorpay from 'razorpay';
import OrderModel from '../models/order.model.js';
import CustomerModel from '../models/customer.model.js';
import ProductModel from '../models/product.model.js';
import crypto from 'crypto';

// Lazily initialize Razorpay so dotenv has loaded before this runs
let _razorpay = null;
const getRazorpay = () => {
  if (!_razorpay) {
    _razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return _razorpay;
};

export const createPaymentOrder = async (req, res) => {
    try {
        const { shippingAddress } = req.body;
        const userId = req.user._id;

        // 1. Authenticate & Load User Cart
        const user = await CustomerModel.findById(userId).populate('cart.product');
        
        // 2. Cart Empty Check
        if (!user || !user.cart || user.cart.length === 0) {
            return res.status(400).json({ success: false, message: "Cart is empty" });
        }

        let totalAmount = 0;
        const orderItems = [];

        // 3. Verify each product exists and stock is sufficient
        for (const item of user.cart) {
            // Load fresh product data directly from DB
            const product = await ProductModel.findById(item.product._id);
            if (!product) {
                return res.status(400).json({ success: false, message: `Product ${item.product.name} no longer exists` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });
            }

            // 4. Calculate total securely on server
            const itemTotal = product.price * item.quantity;
            totalAmount += itemTotal;

            // 5. Build order snapshot (intentionally different from Cart model)
            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                image: product.image
            });
        }

        // 6. Create Pending ShopKart Order in DB
        const newOrder = new OrderModel({
            user: userId,
            items: orderItems,
            shippingAddress,
            totalAmount,
            status: "PENDING_PAYMENT",
            paymentStatus: "PENDING"
        });

        await newOrder.save();

        // 7. Create Razorpay Order via real API
        const options = {
            amount: totalAmount * 100, // Razorpay expects amount in paise
            currency: "INR",
            receipt: newOrder._id.toString()
        };

        const razorpayOrder = await getRazorpay().orders.create(options);
        
        // 8. Save razorpayOrderId to our ShopKart order
        newOrder.razorpayOrderId = razorpayOrder.id;
        await newOrder.save();

        // 9. Return Checkout Data to frontend
        return res.status(200).json({
            success: true,
            message: "Order created successfully",
            order: newOrder,
            razorpayOrder,
            razorpayKeyId: process.env.RAZORPAY_KEY_ID // Send key_id to client for checkout
        });

    } catch (error) {
        console.error("Error creating payment order:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const userId = req.user._id;

        // 1. Find the pending order
        const order = await OrderModel.findOne({ razorpayOrderId: razorpay_order_id });
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // 2. Verify HMAC SHA256 Signature using real secret key
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");
        
        const isValid = expectedSignature === razorpay_signature;

        // 3. Signature Valid?
        if (isValid) {
            // Mark Payment PAID & Order PLACED
            order.paymentStatus = 'PAID';
            order.status = 'PLACED';
            order.razorpayPaymentId = razorpay_payment_id;
            await order.save();

            // Clear User Cart after successful payment
            const user = await CustomerModel.findById(userId);
            user.cart = [];
            await user.save();

            return res.status(200).json({ success: true, message: "Payment verified successfully", order });
        } else {
            // Invalid Signature: mark failed, do NOT clear cart
            order.paymentStatus = 'FAILED';
            await order.save();
            return res.status(400).json({ success: false, message: "Invalid payment signature" });
        }
    } catch (error) {
        console.error("Error verifying payment:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};

export const getOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const order = await OrderModel.findOne({ _id: id, user: userId });
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        return res.status(200).json({ success: true, order });
    } catch (error) {
        console.error("Error fetching order:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};

export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user._id;

        const orders = await OrderModel.find({ user: userId })
            .sort({ createdAt: -1 }); // Newest first

        return res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error("Error fetching user orders:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};
