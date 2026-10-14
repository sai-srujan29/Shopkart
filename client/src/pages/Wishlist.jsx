import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import WishlistCard from '../components/WishlistCard';
import { getWishlist } from '../services/api';

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError(false);
      const res = await getWishlist();
      setWishlist(res.data.wishlist || []);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleProductRemove = (productId) => {
    setWishlist((prev) => prev.filter((p) => p._id !== productId));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">My Wishlist</h1>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-32 bg-white rounded-2xl shadow-sm border border-gray-100">
              <p className="text-gray-500 text-lg font-medium flex items-center gap-3">
                <span className="w-6 h-6 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></span>
                Loading your wishlist...
              </p>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="text-4xl mb-4">❌</div>
              <p className="text-gray-800 text-xl font-bold mb-6">Unable to load wishlist.</p>
              <button
                onClick={fetchWishlist}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md shadow-indigo-200"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && wishlist.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="text-rose-500 text-5xl mb-4">❤️</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Your wishlist is empty</h2>
              <p className="text-gray-500 mb-8 max-w-md text-center">
                Start saving products you love.
              </p>
              <button
                onClick={() => navigate('/products')}
                className="px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 font-semibold"
              >
                Browse Products
              </button>
            </div>
          )}

          {/* Success / Populated State */}
          {!loading && !error && wishlist.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {wishlist.map((product) => (
                <WishlistCard 
                  key={product._id} 
                  product={product} 
                  onRemove={handleProductRemove} 
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
