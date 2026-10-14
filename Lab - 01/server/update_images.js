import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from './models/product.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

// Real working product images from Unsplash (free, no auth needed)
const imageMap = {
  'Mechanical Keyboard': 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=300&fit=crop',
  'HelloWorld':           'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop',
  'Test Headphones':      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
};

// Fallbacks by category
const categoryImageMap = {
  'Electronics': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop',
  'Audio':        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
  'Clothing':     'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
  'Books':        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop',
  'Food':         'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&h=300&fit=crop',
};

const defaultImage = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop';

async function updateImages() {
  await mongoose.connect(process.env.dbUrl);
  console.log('DB connected');

  const products = await Product.find({});
  console.log(`Found ${products.length} products to update`);

  for (const product of products) {
    const newImage =
      imageMap[product.name] ||
      categoryImageMap[product.category] ||
      defaultImage;

    await Product.findByIdAndUpdate(product._id, { image: newImage });
    console.log(`Updated: ${product.name} → image set`);
  }

  console.log('All products updated with real images!');
  await mongoose.disconnect();
}

updateImages().catch(console.error);
