import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/common/Navbar';
import { CardSkeleton } from '../components/common/SkeletonLoader';
import api from '../utils/api';

const Dashboard = () => {
  const [balanceData, setBalanceData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBalanceData();
  }, []);

  const fetchBalanceData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users/balance');
      setBalanceData(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch balance data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] pb-24 md:pb-8">
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-6 px-2">
          <h1 className="text-2xl font-bold text-[#1c1e21]">Dashboard</h1>
          <p className="text-[#65676b] text-sm">Summary of your shared expenses</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Quick Balance Summary Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total You Owe</p>
                <p className="text-2xl font-bold text-red-600">₹{balanceData?.totalOwes?.toFixed(2) || '0.00'}</p>
              </div>
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Owed to You</p>
                <p className="text-2xl font-bold text-emerald-600">₹{balanceData?.totalOwed?.toFixed(2) || '0.00'}</p>
              </div>
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Net Balance</p>
                <p className={`text-2xl font-bold ${(balanceData?.totalOwed - balanceData?.totalOwes) >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                  ₹{(balanceData?.totalOwed - balanceData?.totalOwes).toFixed(2)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Owe Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                  <h2 className="font-bold text-[#1c1e21]">People you owe</h2>
                </div>
                <div className="p-2">
                  {balanceData?.owes?.length > 0 ? (
                    balanceData.owes.map((balance) => (
                      <div key={balance.user._id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold">
                            {balance.user.username[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-[#1c1e21]">{balance.user.username}</p>
                            <p className="text-xs text-[#65676b]">Outstanding debt</p>
                          </div>
                        </div>
                        <p className="font-bold text-red-600">₹{balance.amount.toFixed(2)}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-400 text-sm">No pending payments.</div>
                  )}
                </div>
              </div>

              {/* Owed Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                  <h2 className="font-bold text-[#1c1e21]">People who owe you</h2>
                </div>
                <div className="p-2">
                  {balanceData?.owed?.length > 0 ? (
                    balanceData.owed.map((balance) => (
                      <div key={balance.user._id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                            {balance.user.username[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-[#1c1e21]">{balance.user.username}</p>
                            <p className="text-xs text-[#65676b]">To be received</p>
                          </div>
                        </div>
                        <p className="font-bold text-emerald-600">₹{balance.amount.toFixed(2)}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-400 text-sm">Everyone is settled up.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODERN FLOATING ACTION BUTTON */}
      <div className="fixed bottom-6 right-6 z-50 md:hidden">
        <Link to="/groups">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 bg-[#1877f2] hover:bg-[#166fe5] text-white px-5 py-3 rounded-full shadow-lg font-bold transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Groups</span>
          </motion.button>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;