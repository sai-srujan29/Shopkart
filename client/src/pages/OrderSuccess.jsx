import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getOrder } from '../services/api';

const OrderSuccess = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await getOrder(id);
        setOrder(response.data.order);
      } catch (err) {
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="max-w-3xl w-full mx-auto p-6 flex-1 mt-12 flex flex-col items-center">
        {loading ? (
          <div className="text-gray-500 font-medium">Loading your order details...</div>
        ) : !order ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-red-100 w-full">
            <h2 className="text-xl text-red-600 mb-4">Order not found</h2>
            <button
              onClick={() => navigate('/products')}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              Back to Shop
            </button>
          </div>
        ) : (
          <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-gray-100 w-full text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center text-4xl mb-6 shadow-inner">
              ✅
            </div>
            
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Order Placed Successfully</h1>
            <p className="text-gray-500 mb-10 text-lg">Your order has been saved successfully.</p>
            
            <div className="bg-gray-50 rounded-2xl w-full p-6 sm:p-8 text-left border border-gray-100 space-y-4 mb-10 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between pb-4 border-b border-gray-200 gap-2">
                <span className="text-gray-500 font-medium text-sm tracking-wider uppercase">Order ID</span>
                <span className="font-mono text-gray-800 font-semibold truncate bg-white px-3 py-1 rounded border border-gray-200">{order._id}</span>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between pb-4 border-b border-gray-200 gap-2">
                <span className="text-gray-500 font-medium text-sm tracking-wider uppercase">Status</span>
                <span className="text-green-600 font-bold tracking-wider bg-green-50 px-3 py-1 rounded-full border border-green-200 w-max self-start sm:self-auto">{order.status}</span>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between pt-2 gap-2">
                <span className="text-gray-500 font-medium text-sm tracking-wider uppercase">Total Amount</span>
                <span className="font-bold text-2xl text-[#5244e1]">₹{order.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <button 
                onClick={() => navigate('/products')}
                className="px-8 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition"
              >
                Continue Shopping
              </button>
              <button 
                onClick={() => navigate('/orders')}
                className="px-8 py-3 bg-[#5244e1] text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-[0_4px_14px_0_rgba(82,68,225,0.39)] transform hover:-translate-y-0.5"
              >
                View My Orders
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default OrderSuccess;
