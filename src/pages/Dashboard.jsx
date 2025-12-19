import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-display font-bold text-primary-800 mb-2">Dashboard</h1>
          <p className="text-primary-600/70">Track your expenses and balances</p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* You Owe Section */}
            <motion.div
              variants={itemVariants}
              className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft border border-primary-100/50 p-6 card-hover"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-50 rounded-2xl flex items-center justify-center shadow-inner">
                    <span className="text-2xl">📤</span>
                  </div>
                  <h2 className="text-xl font-display font-bold text-primary-800">You Owe</h2>
                </div>
                <div className="text-3xl font-display font-bold text-red-500">
                  ₹{balanceData?.totalOwes?.toFixed(2) || '0.00'}
                </div>
              </div>

              {balanceData?.owes?.length > 0 ? (
                <div className="space-y-3">
                  {balanceData.owes.map((balance, index) => (
                    <motion.div
                      key={balance.user._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-red-50/50 rounded-2xl border border-red-100/50 hover:shadow-soft transition-all"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-11 h-11 bg-gradient-to-br from-red-400 to-red-500 rounded-xl flex items-center justify-center shadow-md">
                          <span className="text-white font-bold text-sm">
                            {balance.user.username[0].toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-primary-800">{balance.user.username}</p>
                          <p className="text-sm text-primary-500/70">{balance.user.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-red-500">
                          ₹{balance.amount.toFixed(2)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <motion.span 
                    className="text-5xl block mb-3"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🎉
                  </motion.span>
                  <p className="text-primary-600/70 font-medium">You don't owe anyone!</p>
                </div>
              )}
            </motion.div>

            {/* You Are Owed Section */}
            <motion.div
              variants={itemVariants}
              className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft border border-primary-100/50 p-6 card-hover"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-2xl flex items-center justify-center shadow-inner">
                    <span className="text-2xl">📥</span>
                  </div>
                  <h2 className="text-xl font-display font-bold text-primary-800">You Are Owed</h2>
                </div>
                <div className="text-3xl font-display font-bold text-emerald-500">
                  ₹{balanceData?.totalOwed?.toFixed(2) || '0.00'}
                </div>
              </div>

              {balanceData?.owed?.length > 0 ? (
                <div className="space-y-3">
                  {balanceData.owed.map((balance, index) => (
                    <motion.div
                      key={balance.user._id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-emerald-50/50 rounded-2xl border border-emerald-100/50 hover:shadow-soft transition-all"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-11 h-11 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-md">
                          <span className="text-white font-bold text-sm">
                            {balance.user.username[0].toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-primary-800">{balance.user.username}</p>
                          <p className="text-sm text-primary-500/70">{balance.user.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-emerald-500">
                          ₹{balance.amount.toFixed(2)}
                        </p>
                        <p className="text-xs text-primary-500/60 mt-0.5">owes you</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <motion.span 
                    className="text-5xl block mb-3"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  >
                    💰
                  </motion.span>
                  <p className="text-primary-600/70 font-medium">No one owes you money</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}

        {/* Net Balance Summary */}
        {!loading && balanceData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 bg-gradient-to-r from-primary-500 via-primary-400 to-accent-light/80 rounded-3xl shadow-large p-8 text-white relative overflow-hidden"
          >
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-accent-mint/20 rounded-full blur-2xl" />
            </div>

            <div className="flex items-center justify-between relative z-10">
              <div>
                <h3 className="text-lg font-medium text-white/80 mb-1">Net Balance</h3>
                <p className="text-4xl font-display font-bold">
                  ₹{(balanceData.totalOwed - balanceData.totalOwes).toFixed(2)}
                </p>
                <p className="text-sm text-white/70 mt-2">
                  {balanceData.totalOwed > balanceData.totalOwes 
                    ? "You're in the green! 🎉" 
                    : balanceData.totalOwed < balanceData.totalOwes 
                    ? "Time to settle up! 💸" 
                    : "All balanced! ⚖️"}
                </p>
              </div>
              <motion.div 
                className="text-7xl"
                animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {balanceData.totalOwed > balanceData.totalOwes ? '📈' : 
                 balanceData.totalOwed < balanceData.totalOwes ? '📉' : '⚖️'}
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
