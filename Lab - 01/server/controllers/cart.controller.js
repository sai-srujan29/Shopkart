import mongoose from 'mongoose';
import ProductModel from '../models/product.model.js';
import CustomerModel from '../models/customer.model.js';

export const addToCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const user = req.user;
        user.cart = user.cart || [];

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ success: false, message: 'Invalid product ID' });
        }

        const product = await ProductModel.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product Not Found' });
        }

        const cartItemIndex = user.cart.findIndex(item => item.product.toString() === productId);

        if (cartItemIndex === -1) {
            if (product.stock < 1) {
                return res.status(400).json({ success: false, message: 'Not enough stock' });
            }
            user.cart.push({ product: productId, quantity: 1 });
        } else {
            const newQuantity = user.cart[cartItemIndex].quantity + 1;
            if (newQuantity > product.stock) {
                return res.status(400).json({ success: false, message: 'Not enough stock' });
            }
            user.cart[cartItemIndex].quantity = newQuantity;
        }

        await user.save();
        await user.populate({ path: 'cart.product', select: 'name price category image stock' });

        return res.status(200).json({ success: true, message: 'Cart updated', cart: user.cart });
    } catch (error) {
        console.error("Error adding to cart:", error);
        return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};

export const getCart = async (req, res) => {
    try {
        const userId = req.user._id;
        
        const user = await CustomerModel.findById(userId).populate({
            path: 'cart.product',
            select: 'name price category image stock'
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        return res.status(200).json({
            success: true,
            cart: user.cart
        });
    } catch (error) {
        console.error("Error fetching cart:", error);
        return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};

export const updateCartQuantity = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;
        const user = req.user;
        user.cart = user.cart || [];

        if (typeof quantity !== 'number' || isNaN(quantity)) {
            return res.status(400).json({ success: false, message: 'Quantity must be a number' });
        }

        if (quantity < 1) {
            return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
        }

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ success: false, message: 'Invalid product ID' });
        }

        const product = await ProductModel.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const cartItemIndex = user.cart.findIndex(item => item.product.toString() === productId);
        if (cartItemIndex === -1) {
            return res.status(404).json({ success: false, message: 'Product not in cart' });
        }

        if (quantity > product.stock) {
            return res.status(400).json({ success: false, message: 'Quantity cannot exceed stock' });
        }

        user.cart[cartItemIndex].quantity = quantity;
        await user.save();
        await user.populate({ path: 'cart.product', select: 'name price category image stock' });

        return res.status(200).json({ success: true, message: 'Cart updated', cart: user.cart });
    } catch (error) {
        console.error("Error updating cart quantity:", error);
        return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const user = req.user;
        user.cart = user.cart || [];

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ success: false, message: 'Invalid product ID' });
        }

        const cartItemIndex = user.cart.findIndex(item => item.product.toString() === productId);
        if (cartItemIndex === -1) {
            return res.status(404).json({ success: false, message: 'Product not in cart' });
        }

        user.cart.splice(cartItemIndex, 1);
        await user.save();
        await user.populate({ path: 'cart.product', select: 'name price category image stock' });

        return res.status(200).json({ success: true, message: 'Product removed from cart', cart: user.cart });
    } catch (error) {
        console.error("Error removing from cart:", error);
        return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};
