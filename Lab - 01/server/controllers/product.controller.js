import Product from '../models/product.model.js';
import mongoose from 'mongoose';

export const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, image, stock } = req.body;
        
        if (!name || !description || price === undefined || !category || !image || stock === undefined) {
            return res.status(400).json({ message: "Missing required field" });
        }
        
        if (price <= 0) {
            return res.status(400).json({ message: "Invalid price" });
        }
        
        if (stock < 0) {
            return res.status(400).json({ message: "Invalid stock" });
        }
        
        const newProduct = new Product({
            name,
            description,
            price,
            category,
            image,
            stock
        });
        
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
        
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const { search, category } = req.query;
        let query = {};  
        
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }
        
        if (category) {
            query.category = category;
        }

        const products = await Product.find(query, '_id name price category image stock');
        res.status(200).json({
            success: true,
            count: products.length,
            products: products
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
