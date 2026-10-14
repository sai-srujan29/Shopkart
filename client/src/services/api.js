import axios from 'axios';

const API = axios.create({
  baseURL: '/api/customers',
  withCredentials: true,
});

export const registerCustomer = (data) => API.post('/register', data);
export const loginCustomer = (data) => API.post('/login', data);
export const getMe = () => API.get('/me');
export const logoutCustomer = () => API.post('/logout');

// Product API
const PRODUCT_API = axios.create({
  baseURL: '/api/products',
  withCredentials: true,
});

export const getAllProducts = (params) => PRODUCT_API.get('/', { params });
export const getProductById = (id) => PRODUCT_API.get(`/${id}`);

// Wishlist API
const WISHLIST_API = axios.create({
  baseURL: '/api/wishlist',
  withCredentials: true,
});

export const getWishlist = () => WISHLIST_API.get('/');
export const addToWishlist = (productId) => WISHLIST_API.post(`/${productId}`);
export const removeFromWishlist = (productId) => WISHLIST_API.delete(`/${productId}`);

// Cart API
const CART_API = axios.create({
  baseURL: '/api/cart',
  withCredentials: true,
});

export const getCart = () => CART_API.get('/');
export const addToCart = (productId) => CART_API.post(`/${productId}`);
export const updateCartQuantity = (productId, quantity) => CART_API.patch(`/${productId}`, { quantity });
export const removeFromCart = (productId) => CART_API.delete(`/${productId}`);

// Orders API
const ORDER_API = axios.create({
  baseURL: '/api/orders',
  withCredentials: true,
});

export const createPaymentOrder = (shippingAddress) => ORDER_API.post('/create-payment-order', { shippingAddress });
export const verifyPayment = (paymentData) => ORDER_API.post('/verify-payment', paymentData);
export const getOrder = (orderId) => ORDER_API.get(`/${orderId}`);
export const getUserOrders = () => ORDER_API.get('/');

export default API;
