import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { removeFromWishlist } from '../services/api';

const WishlistCard = ({ product, onRemove }) => {
  const navigate = useNavigate();
  const [removing, setRemoving] = useState(false);

  const handleRemove = async () => {
    try {
      setRemoving(true);
      await removeFromWishlist(product._id);
      onRemove(product._id);
    } catch (err) {
      console.error('Failed to remove from wishlist:', err);
      setRemoving(false);
      alert('Unable to remove item. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300 relative border border-gray-100">
      {/* Product Image */}
      <div className="w-full h-48 bg-gray-50 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover mix-blend-multiply"
          onError={(e) => {
            e.target.src = 'https://placehold.co/300x200?text=No+Image';
          }}
        />
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

        {/* Actions */}
        <div className="mt-auto flex flex-col gap-2">
          <button
            className="w-full py-2 rounded-lg font-semibold text-sm transition bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
            onClick={() => navigate(`/products/${product._id}`)}
          >
            View Details
          </button>
          
          <button
            className="w-full py-2 rounded-lg font-semibold text-sm transition bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center gap-1"
            onClick={handleRemove}
            disabled={removing}
          >
            {removing ? 'Removing...' : 'Remove ♥'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WishlistCard;
