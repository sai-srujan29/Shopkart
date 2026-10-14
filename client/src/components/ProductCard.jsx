import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [wishlistStatus, setWishlistStatus] = useState('default'); // 'default', 'saving', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');
  
  const { cartItems, addToCart } = useCart();
  const [cartStatus, setCartStatus] = useState('default'); // 'default', 'adding'

  const inCart = (cartItems || []).find(item => {
    const itemId = item.product?._id || item.product;
    return itemId === product._id;
  });

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (cartStatus === 'adding') return;
    setCartStatus('adding');
    await addToCart(product._id);
    setCartStatus('default');
  };

  const handleWishlist = async () => {
    if (wishlistStatus === 'saving' || wishlistStatus === 'success') return;
    
    try {
      setWishlistStatus('saving');
      setErrorMessage('');
      const { addToWishlist } = await import('../services/api');
      await addToWishlist(product._id);
      setWishlistStatus('success');
    } catch (err) {
      setWishlistStatus('error');
      setErrorMessage(err.response?.data?.message || 'Unable to save product. Please try again.');
      
      setTimeout(() => {
        setWishlistStatus('default');
        setErrorMessage('');
      }, 3000);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300 relative">
      {/* Product Image */}
      <div className="w-full h-48 bg-gray-100 overflow-hidden relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://placehold.co/300x200?text=No+Image';
          }}
        />
        <div className="absolute top-2 right-2 bg-white/80 p-1 rounded-full text-xs">
          <button 
             onClick={handleWishlist}
             disabled={wishlistStatus === 'saving'}
             className="flex items-center gap-1 font-medium hover:text-indigo-600 transition"
          >
             {wishlistStatus === 'default' && <span>♡ Add to Wishlist</span>}
             {wishlistStatus === 'saving' && <span>⏳ Saving...</span>}
             {wishlistStatus === 'success' && <span className="text-pink-500">♥ Added to Wishlist</span>}
             {wishlistStatus === 'error' && <span className="text-red-500">{errorMessage}</span>}
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-1">
        <h2 className="text-lg font-semibold text-gray-800 mb-1 truncate">{product.name}</h2>
        <p className="text-sm text-indigo-500 font-medium mb-1">{product.category}</p>
        <p className="text-xl font-bold text-gray-900 mb-2">
          ₹{product.price.toLocaleString('en-IN')}
        </p>
        <p className={`text-sm font-medium mb-4 ${product.stock === 0 ? 'text-red-500' : 'text-green-600'}`}>
          {product.stock === 0 ? 'Out of Stock' : `${product.stock} units left`}
        </p>

        <div className="mt-auto flex flex-col gap-2 w-full">
          {/* Add to Cart Button */}
          <button
            className={`w-full py-2 rounded-lg font-semibold text-sm transition ${
              product.stock === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : inCart 
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
            onClick={handleAddToCart}
            disabled={product.stock === 0 || cartStatus === 'adding'}
          >
            {cartStatus === 'adding' ? 'Adding...' : inCart ? 'Add Another' : 'Add to Cart'}
          </button>

          {/* View Details Button */}
          <button
            className="w-full py-2 rounded-lg font-semibold text-sm transition bg-gray-100 text-gray-800 hover:bg-gray-200"
            onClick={() => navigate(`/products/${product._id}`)}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
