import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { getMe, createPaymentOrder, verifyPayment } from '../services/api';

const Checkout = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { cartItems, fetchCart } = useCart();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

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

  // Protect route if cart is empty
  useEffect(() => {
    if (user && !isSuccess && (!cartItems || cartItems.length === 0)) {
      navigate('/cart');
    }
  }, [user, cartItems, navigate, isSuccess]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error for this field when user types
    if (formErrors[e.target.name]) {
      setFormErrors({
        ...formErrors,
        [e.target.name]: null
      });
    }
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    const errors = {};
    
    // Check required fields & whitespace
    const fields = ['fullName', 'phone', 'addressLine1', 'city', 'state', 'pincode'];
    fields.forEach(field => {
      if (!formData[field].trim()) {
        errors[field] = 'This field cannot be empty';
      }
    });

    // Validate phone (10 digits)
    if (formData.phone.trim() && !/^\d{10}$/.test(formData.phone.trim())) {
      errors.phone = 'Phone must be a valid 10-digit number';
    }

    // Validate pincode (6 digits)
    if (formData.pincode.trim() && !/^\d{6}$/.test(formData.pincode.trim())) {
      errors.pincode = 'Pincode must contain 6 digits';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    initiatePayment();
  };

  const initiatePayment = async () => {
    try {
      setLoading(true);
      
      // 1. Create Order on Backend (gets Razorpay order + key_id back)
      const { data } = await createPaymentOrder(formData);
      if (!data.success) throw new Error(data.message);
      
      const { order, razorpayOrder, razorpayKeyId } = data;

      // 2. Configure Razorpay Checkout options
      const options = {
        key: razorpayKeyId,                    // key_id from backend (safe to expose)
        amount: razorpayOrder.amount,          // amount in paise
        currency: razorpayOrder.currency,
        name: "ShopKart",
        description: "Order Payment",
        order_id: razorpayOrder.id,            // Razorpay order ID
        handler: async function (response) {
          // 3. Payment successful — verify signature on backend
          try {
            const verifyRes = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyRes.data.success) {
              setIsSuccess(true);
              await fetchCart(); // Clear cart in UI
              navigate(`/orders/${order._id}`);
            } else {
              alert("Payment verification failed. Please contact support.");
              setLoading(false);
            }
          } catch (err) {
            console.error("Verification error:", err);
            alert(err.response?.data?.message || "Payment verification failed.");
            setLoading(false);
          }
        },
        prefill: {
          name: formData.fullName,
          contact: formData.phone,
        },
        notes: {
          address: `${formData.addressLine1}, ${formData.city}, ${formData.state} - ${formData.pincode}`
        },
        theme: {
          color: "#5244e1"
        },
        modal: {
          ondismiss: function () {
            // User closed the payment dialog without paying
            setLoading(false);
          }
        }
      };

      // 4. Open Razorpay Checkout Window
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        alert(`Payment Failed: ${response.error.description}`);
        setLoading(false);
      });
      rzp.open();

    } catch (err) {
      console.error("Error creating order:", err);
      alert(err.response?.data?.message || err.message || "Failed to create order");
      setLoading(false);
    }
  };

  if (!user || !cartItems || cartItems.length === 0) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + ((item.product?.price || 0) * item.quantity), 0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar user={user} />
      
      <main className="max-w-4xl w-full mx-auto p-6 flex-1 mt-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Shipping Details Form */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Shipping Details</h2>
            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" name="fullName" required 
                  value={formData.fullName} onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg outline-none transition focus:ring-2 ${formErrors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'}`}
                />
                {formErrors.fullName && <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input 
                  type="tel" name="phone" required 
                  value={formData.phone} onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg outline-none transition focus:ring-2 ${formErrors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'}`}
                />
                {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                <input 
                  type="text" name="addressLine1" required 
                  value={formData.addressLine1} onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg outline-none transition focus:ring-2 ${formErrors.addressLine1 ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'}`}
                />
                {formErrors.addressLine1 && <p className="text-red-500 text-xs mt-1">{formErrors.addressLine1}</p>}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input 
                    type="text" name="city" required 
                    value={formData.city} onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg outline-none transition focus:ring-2 ${formErrors.city ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'}`}
                  />
                  {formErrors.city && <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input 
                    type="text" name="state" required 
                    value={formData.state} onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg outline-none transition focus:ring-2 ${formErrors.state ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'}`}
                  />
                  {formErrors.state && <p className="text-red-500 text-xs mt-1">{formErrors.state}</p>}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                <input 
                  type="text" name="pincode" required 
                  value={formData.pincode} onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg outline-none transition focus:ring-2 ${formErrors.pincode ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'}`}
                />
                {formErrors.pincode && <p className="text-red-500 text-xs mt-1">{formErrors.pincode}</p>}
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-fit">
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {cartItems.map(item => (
                <div key={item.product._id} className="flex justify-between items-center text-gray-600">
                  <span className="truncate pr-4">{item.product.name} <span className="font-semibold text-gray-800 text-sm">× {item.quantity}</span></span>
                  <span className="font-medium whitespace-nowrap">₹{((item.product.price || 0) * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between text-xl font-bold text-gray-900 pt-4 border-t border-gray-200 mb-8">
              <span>Total</span>
              <span className="text-[#5244e1]">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            
            <button 
              onClick={handlePlaceOrder}
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-lg text-white transition transform shadow-[0_4px_14px_0_rgba(82,68,225,0.39)] 
                ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-[#5244e1] hover:bg-indigo-700 hover:-translate-y-0.5'}`}
            >
              {loading ? 'Processing...' : 'Pay with Razorpay'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
