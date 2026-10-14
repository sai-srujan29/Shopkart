import express from 'express';
import { addToCart, getCart, updateCartQuantity, removeFromCart } from '../controllers/cart.controller.js';
import { isAuthenticated } from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.get('/', isAuthenticated, getCart);
router.post('/:productId', isAuthenticated, addToCart);
router.patch('/:productId', isAuthenticated, updateCartQuantity);
router.delete('/:productId', isAuthenticated, removeFromCart);

export default router;
