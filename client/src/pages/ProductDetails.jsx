import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/api';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getProductById(id);
      setProduct(res.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Product not found.');
      } else if (err.response?.status === 400) {
        setError('Invalid product ID.');
      } else {
        setError('Failed to load product. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 text-lg font-medium">Loading product...</p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="text-red-500 text-xl font-semibold">{error}</p>
        <button
          onClick={() => navigate('/products')}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/products')}
          className="mb-6 flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition"
        >
          ← Back to Products
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row">
          {/* Product Image */}
          <div className="md:w-1/2 h-64 md:h-auto bg-gray-100">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://placehold.co/400x300?text=No+Image';
              }}
            />
          </div>

          {/* Product Details */}
          <div className="md:w-1/2 p-8 flex flex-col justify-between">
            <div>
              <span className="inline-block bg-indigo-100 text-indigo-600 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                {product.category}
              </span>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">{product.name}</h1>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">{product.description}</p>

              <div className="flex items-center gap-4 mb-4">
                <p className="text-3xl font-bold text-indigo-600">
                  ₹{product.price.toLocaleString('en-IN')}
                </p>
              </div>

              <p className={`text-sm font-semibold mb-6 ${product.stock === 0 ? 'text-red-500' : 'text-green-600'}`}>
                {product.stock === 0 ? '❌ Out of Stock' : `✅ ${product.stock} units in stock`}
              </p>
            </div>

            <button
              disabled={product.stock === 0}
              className={`w-full py-3 rounded-xl font-semibold text-base transition ${
                product.stock === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
