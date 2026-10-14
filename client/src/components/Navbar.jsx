import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutCustomer } from '../services/api';
import { useCart } from '../context/CartContext';

const Navbar = ({ user }) => {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const cartCount = (cartItems || []).reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = async () => {
    try {
      await logoutCustomer();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login');
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <span className="text-2xl font-bold text-[#5244e1] cursor-pointer" onClick={() => navigate('/home')}>ShopKart</span>
      </div>
      <div className="flex items-center space-x-6">
        <button
          onClick={() => navigate('/home')}
          className="text-gray-600 hover:text-indigo-600 font-medium transition-colors"
        >
          Home
        </button>
        <button
          onClick={() => navigate('/products')}
          className="text-gray-600 hover:text-indigo-600 font-medium transition-colors"
        >
          Products
        </button>
        <button
          onClick={() => navigate('/wishlist')}
          className="text-gray-600 hover:text-pink-600 font-medium transition-colors"
        >
          Wishlist
        </button>
        <button
          onClick={() => navigate('/cart')}
          className="text-gray-600 hover:text-[#5244e1] font-bold transition-colors flex items-center gap-1"
        >
          Cart <span className="bg-[#5244e1] text-white text-xs px-2 py-0.5 rounded-full">{cartCount}</span>
        </button>
        
        {user && (
          <span className="text-sm font-medium text-gray-700 hidden sm:inline-block ml-4 border-l border-gray-300 pl-4">
            {user.fullName}
          </span>
        )}
        <button
          onClick={handleLogout}
          className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors ml-4"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
