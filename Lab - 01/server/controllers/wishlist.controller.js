import mongoose from 'mongoose';
import CustomerModel from '../models/customer.model.js';
import ProductModel from '../models/product.model.js';

export const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const user = req.user;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ success: false, message: 'Invalid product ID' });
        }

        const product = await ProductModel.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product Not Found' });
        }


        if (user.wishlist.includes(productId)) {
            return res.status(409).json({ success: false, message: 'Product already in wishlist' });
        }

        user.wishlist.push(productId);
        await user.save();

        return res.status(200).json({ success: true, message: 'Product added to wishlist' });
    } catch (error) {
        console.error("Error adding to wishlist:", error);
        return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};

export const getWishlist = async (req, res) => {
    try {
        const userId = req.user._id;
        
        const user = await CustomerModel.findById(userId).populate({
            path: 'wishlist',
            select: 'name price category image stock'
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        return res.status(200).json({
            success: true,
            count: user.wishlist.length,
            wishlist: user.wishlist
        });
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};

export const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const user = req.user;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ success: false, message: 'Invalid product ID' });
        }

        const productIndex = user.wishlist.findIndex(id => id.toString() === productId);
        if (productIndex === -1) {
            return res.status(404).json({ success: false, message: 'Product not in wishlist' });
        }

        user.wishlist.splice(productIndex, 1);
        await user.save();

        return res.status(200).json({ success: true, message: 'Product removed from wishlist' });
    } catch (error) {
        console.error("Error removing from wishlist:", error);
        return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};
