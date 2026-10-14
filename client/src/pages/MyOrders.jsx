import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getUserOrders } from '../services/api';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await getUserOrders();
      setOrders(response.data.orders || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="max-w-5xl w-full mx-auto p-6 flex-1 mt-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 font-medium">Loading your orders...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-red-100">
            <h2 className="text-xl text-red-600 font-semibold mb-6">Unable to load orders.</h2>
            <button
              onClick={fetchOrders}
              className="bg-red-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-red-700 transition shadow-md"
            >
              Try Again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="text-5xl mb-4">🛍️</div>
            <h2 className="text-2xl text-gray-800 font-bold mb-2">You have not placed any orders yet.</h2>
            <p className="text-gray-500 mb-8 text-lg">Looks like you haven't bought anything from us.</p>
            <button
              onClick={() => navigate('/products')}
              className="bg-[#5244e1] text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-md shadow-indigo-200"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition flex flex-col">
                <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500 font-bold tracking-widest uppercase mb-1">Order ID</p>
                    <p className="font-mono text-gray-800 font-semibold">{order._id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-500">{formatDate(order.createdAt)}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6 flex-1">
                  {order.items.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex justify-between text-gray-700">
                      <span className="truncate pr-4 font-medium">{item.name}</span>
                      <span className="text-gray-500 text-sm whitespace-nowrap">× {item.quantity}</span>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <p className="text-sm text-gray-400 italic mt-2">+ {order.items.length - 3} more items</p>
                  )}
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <p className="text-xs text-gray-500 font-bold tracking-widest uppercase mb-1">Total</p>
                      <p className="font-bold text-xl text-[#5244e1]">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 font-bold tracking-widest uppercase mb-1">Status</p>
                      <p className={`font-bold px-3 py-1 rounded text-sm inline-block ${
                        order.status === 'PLACED' ? 'bg-green-50 text-green-600 border border-green-200' :
                        order.status === 'PENDING_PAYMENT' ? 'bg-yellow-50 text-yellow-600 border border-yellow-200' :
                        'bg-gray-50 text-gray-700 border border-gray-200'
                      }`}>
                        {order.status}
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={() => navigate(`/orders/${order._id}`)}
                    className="w-full bg-gray-50 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-100 transition border border-gray-200"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyOrders;
