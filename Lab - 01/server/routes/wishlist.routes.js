import express from 'express';
import { addToWishlist, getWishlist, removeFromWishlist } from '../controllers/wishlist.controller.js';
import { isAuthenticated } from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.get('/', isAuthenticated, getWishlist);
router.post('/:productId', isAuthenticated, addToWishlist);
router.delete('/:productId', isAuthenticated, removeFromWishlist);

export default router;
