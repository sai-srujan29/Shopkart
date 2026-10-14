import express from 'express';
import { createPaymentOrder, verifyPayment, getOrder, getUserOrders } from '../controllers/order.controller.js';
import { isAuthenticated } from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.post('/create-payment-order', isAuthenticated, createPaymentOrder);
router.post('/verify-payment', isAuthenticated, verifyPayment);
router.get('/', isAuthenticated, getUserOrders);
router.get('/:id', isAuthenticated, getOrder);

export default router;
