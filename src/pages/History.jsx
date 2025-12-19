import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import Navbar from '../components/common/Navbar';
import { TableSkeleton } from '../components/common/SkeletonLoader';
import api from '../utils/api';

const History = () => {
  const [expenses, setExpenses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('expenses');
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });

  useEffect(() => {
    fetchData();
  }, [activeTab, pagination.page]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'expenses') {
        const response = await api.get(`/expenses/user?page=${pagination.page}&limit=10`);
        setExpenses(response.data.data);
        setPagination(response.data.pagination);
      } else {
        const response = await api.get(`/payments?page=${pagination.page}&limit=10`);
        setPayments(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      toast.error('Failed to fetch history');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
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
          <h1 className="text-3xl font-display font-bold text-primary-800 mb-2">History</h1>
          <p className="text-primary-600/70">View all your expenses and payments</p>
        </motion.div>

        {/* Tabs */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft border border-primary-100/50 overflow-hidden">
          <div className="flex border-b border-primary-100/50">
            <button
              onClick={() => {
                setActiveTab('expenses');
                setPagination({ page: 1, pages: 1 });
              }}
              className={`flex-1 px-6 py-4 font-bold transition-all ${
                activeTab === 'expenses'
                  ? 'bg-gradient-to-b from-primary-50/50 to-transparent text-primary-600 border-b-3 border-primary-500'
                  : 'text-primary-400 hover:text-primary-600 hover:bg-primary-50/30'
              }`}
            >
              📊 Expenses
            </button>
            <button
              onClick={() => {
                setActiveTab('payments');
                setPagination({ page: 1, pages: 1 });
              }}
              className={`flex-1 px-6 py-4 font-bold transition-all ${
                activeTab === 'payments'
                  ? 'bg-gradient-to-b from-primary-50/50 to-transparent text-primary-600 border-b-3 border-primary-500'
                  : 'text-primary-400 hover:text-primary-600 hover:bg-primary-50/30'
              }`}
            >
              💳 Payments
            </button>
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <TableSkeleton rows={5} />
                </motion.div>
              ) : activeTab === 'expenses' ? (
                <motion.div
                  key="expenses"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  {expenses.length > 0 ? (
                    <div className="space-y-3">
                      {expenses.map((expense, index) => (
                        <motion.div
                          key={expense._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="bg-gradient-to-r from-primary-50/50 to-transparent rounded-2xl p-4 border border-primary-100/50 hover:shadow-soft transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <div className="w-11 h-11 bg-gradient-to-br from-primary-400 to-primary-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md">
                                  {expense.paidBy.username[0].toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-semibold text-primary-800">{expense.description}</p>
                                  <p className="text-sm text-primary-600/70">
                                    {expense.group.name} • Paid by {expense.paidBy.username}
                                  </p>
                                  <p className="text-xs text-primary-500/60 mt-1">
                                    {new Date(expense.createdAt).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-display font-bold text-primary-800">₹{expense.amount.toFixed(2)}</p>
                              <span className="text-xs font-medium text-primary-500/70 bg-primary-100/50 px-2 py-0.5 rounded-full">
                                {expense.splitType}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <motion.span 
                        className="text-5xl block mb-3"
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        📊
                      </motion.span>
                      <p className="text-primary-600/70 font-medium">No expenses yet</p>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="payments"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  {payments.length > 0 ? (
                    <div className="space-y-3">
                      {payments.map((payment, index) => (
                        <motion.div
                          key={payment._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="bg-gradient-to-r from-emerald-50/50 to-transparent rounded-2xl p-4 border border-emerald-100/50 hover:shadow-soft transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <div className="w-11 h-11 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-md">
                                  <span className="text-xl">💳</span>
                                </div>
                                <div>
                                  <p className="font-semibold text-primary-800">
                                    {payment.paidBy.username} → {payment.paidTo.username}
                                  </p>
                                  <p className="text-sm text-primary-600/70">{payment.group.name}</p>
                                  {payment.note && (
                                    <p className="text-xs text-primary-500/60 mt-1">📝 {payment.note}</p>
                                  )}
                                  <p className="text-xs text-primary-500/60 mt-1">
                                    {new Date(payment.createdAt).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-display font-bold text-emerald-500">₹{payment.amount.toFixed(2)}</p>
                              <span className="text-xs font-medium text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                                Settled
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <motion.span 
                        className="text-5xl block mb-3"
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        💳
                      </motion.span>
                      <p className="text-primary-600/70 font-medium">No payments yet</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="mt-6 flex items-center justify-center space-x-3">
                <motion.button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-5 py-2.5 bg-primary-50 text-primary-700 rounded-xl font-medium hover:bg-primary-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  whileHover={{ scale: pagination.page === 1 ? 1 : 1.02 }}
                  whileTap={{ scale: pagination.page === 1 ? 1 : 0.98 }}
                >
                  Previous
                </motion.button>
                <span className="px-4 py-2 text-primary-700 font-medium">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <motion.button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="px-5 py-2.5 bg-primary-50 text-primary-700 rounded-xl font-medium hover:bg-primary-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  whileHover={{ scale: pagination.page === pagination.pages ? 1 : 1.02 }}
                  whileTap={{ scale: pagination.page === pagination.pages ? 1 : 0.98 }}
                >
                  Next
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
