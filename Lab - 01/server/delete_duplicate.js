import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from './models/product.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

async function deleteDuplicate() {
  await mongoose.connect(process.env.dbUrl);
  
  const headphones = await Product.find({ name: 'Test Headphones' });
  console.log(`Found ${headphones.length} Test Headphones`);

  if (headphones.length > 1) {
    // Delete the second one (keep the first)
    await Product.findByIdAndDelete(headphones[1]._id);
    console.log(`Deleted duplicate with id: ${headphones[1]._id}`);
  }

  await mongoose.disconnect();
  console.log('Done!');
}

deleteDuplicate().catch(console.error);
