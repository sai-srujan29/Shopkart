import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getMe } from '../services/api';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, cartLoading, cartError, fetchCart } = useCart();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await getMe();
        setUser(data.authenticatedUser || data.user);
      } catch (err) {
        navigate('/login');
      }
    };
    fetchUser();
  }, [navigate]);

  const handleIncrease = (item) => {
    if (item.quantity < item.product.stock) {
      updateQuantity(item.product._id, item.quantity + 1);
    }
  };

  const handleDecrease = (item) => {
    if (item.quantity > 1) {
      updateQuantity(item.product._id, item.quantity - 1);
    }
  };

  const handleRemove = (item) => {
    removeFromCart(item.product._id);
  };

  const safeCartItems = cartItems || [];
  const totalItems = safeCartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = safeCartItems.reduce((acc, item) => acc + ((item.product?.price || 0) * item.quantity), 0);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar user={user} />
      
      <main className="max-w-6xl w-full mx-auto p-6 flex-1 mt-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Cart</h1>
        
        {cartLoading && safeCartItems.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center justify-center">
            <h2 className="text-xl text-gray-600 font-medium animate-pulse">Loading your cart...</h2>
          </div>
        ) : cartError ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-red-100">
            <h2 className="text-xl text-red-600 mb-6 font-semibold">Unable to load your cart.</h2>
            <button
              onClick={() => fetchCart()}
              className="bg-red-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-red-700 transition shadow-md hover:shadow-lg"
            >
              Try Again
            </button>
          </div>
        ) : safeCartItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl text-gray-800 mb-2 font-bold">Your cart is empty 🛒</h2>
            <p className="text-gray-500 mb-8 text-lg">Looks like you haven't added anything yet.</p>
            <button
              onClick={() => navigate('/products')}
              className="bg-[#5244e1] text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 transition shadow-md hover:shadow-lg"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {safeCartItems.filter(item => item && item.product).map((item) => (
                <div key={item.product._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6 items-center hover:shadow-md transition">
                  <div className="w-24 h-24 shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=No+Image' }}
                    />
                  </div>
                  
                  <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left">
                    <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{item.product.name}</h3>
                    <p className="text-[#5244e1] font-bold mt-1 text-lg">₹{item.product.price.toLocaleString('en-IN')}</p>
                    
                    <div className="flex items-center gap-6 mt-4">
                      <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-inner">
                        <button 
                          onClick={() => handleDecrease(item)}
                          disabled={cartLoading || item.quantity <= 1}
                          className="px-3 py-1 font-bold text-gray-600 hover:bg-gray-200 hover:text-black disabled:opacity-30 transition"
                        >
                          -
                        </button>
                        <span className="px-4 font-semibold text-gray-800 bg-white py-1">{item.quantity}</span>
                        <button 
                          onClick={() => handleIncrease(item)}
                          disabled={cartLoading || item.quantity >= item.product.stock}
                          className="px-3 py-1 font-bold text-gray-600 hover:bg-gray-200 hover:text-black disabled:opacity-30 transition"
                        >
                          +
                        </button>
                      </div>
                      <button 
                        onClick={() => handleRemove(item)}
                        disabled={cartLoading}
                        className="text-red-500 text-sm font-medium hover:text-red-700 hover:underline transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  
                  <div className="font-bold text-xl text-gray-900 mt-4 sm:mt-0 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-fit sticky top-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
              <div className="space-y-4 text-gray-600 mb-8">
                <div className="flex justify-between text-lg">
                  <span className="font-medium text-gray-500">Total Items</span>
                  <span className="font-bold text-gray-900">{totalItems}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-4 border-t border-gray-200">
                  <span>Subtotal</span>
                  <span className="text-[#5244e1]">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
              
              <button 
                onClick={() => navigate('/checkout')}
                className="w-full bg-[#5244e1] text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition transform hover:-translate-y-0.5 shadow-[0_4px_14px_0_rgba(82,68,225,0.39)]">
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;
