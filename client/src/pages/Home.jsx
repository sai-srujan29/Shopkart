import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getMe } from '../services/api';

const Home = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getMe();
        const userData = response.data.authenticatedUser || response.data.user || response.data;
        setUser(userData);
      } catch (err) {
        console.error('Error fetching logged-in user:', err);
        setError('Unauthorized access. Please log in.');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5244e1]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <Navbar user={user} />
      
      <main className="flex-grow container mx-auto px-4 py-10 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-100">
            <div className="w-16 h-16 rounded-full bg-indigo-100 text-[#5244e1] flex items-center justify-center text-2xl font-bold">
              {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome, {user?.fullName || 'Customer'}!
              </h1>
              <p className="text-sm text-gray-500">Here are your profile details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1">
                Customer Name
              </span>
              <span className="text-lg font-semibold text-gray-800">
                {user?.fullName || 'N/A'}
              </span>
            </div>

            <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1">
                Email Address
              </span>
              <span className="text-lg font-semibold text-gray-800 break-all">
                {user?.email || 'N/A'}
              </span>
            </div>

            <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1">
                Phone Number
              </span>
              <span className="text-lg font-semibold text-gray-800">
                {user?.phone || user?.phoneNumber || 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
