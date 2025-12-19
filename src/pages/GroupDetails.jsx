import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import io from 'socket.io-client';
import Navbar from '../components/common/Navbar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AddExpenseModal from '../components/modals/AddExpenseModal';
import PaymentModal from '../components/modals/PaymentModal';
import InviteUserModal from '../components/modals/InviteUserModal';
import GroupInfoModal from '../components/modals/GroupInfoModal';
import GroupChat from '../components/group/GroupChat';
import api from '../utils/api';
import { getUser } from '../utils/storage';
import config from '../config/config';

const GroupDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [activeTab, setActiveTab] = useState('expenses');
  const currentUser = getUser();

  useEffect(() => {
    fetchGroupDetails();
    const socket = io(config.SOCKET_URL, { transports: ['websocket'] });
    socket.emit('join-group', id);
    socket.on('new-expense', (newExpense) => {
      setGroup(prev => ({ ...prev, expenses: [newExpense, ...prev.expenses] }));
    });
    socket.on('payment-updated', () => fetchGroupDetails());
    return () => socket.disconnect();
  }, [id]);

  const fetchGroupDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/groups/${id}`);
      setGroup(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch details');
      navigate('/groups');
    } finally { 
      setLoading(false); 
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (!group) return null;

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft border border-primary-100/50 p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <motion.div 
              className="flex items-center space-x-4 cursor-pointer hover:bg-primary-50/50 p-3 -m-3 rounded-2xl transition-colors"
              onClick={() => setShowGroupInfo(true)}
              whileHover={{ scale: 1.01 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-primary-500/30">
                👥
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-primary-800 flex items-center gap-2">
                  {group.name}
                  <span className="text-xs font-bold bg-gradient-to-r from-primary-100 to-accent-light/50 text-primary-600 px-3 py-1 rounded-full uppercase tracking-wide">
                    View Info
                  </span>
                </h1>
                <p className="text-primary-600/70 text-sm mt-1">
                  {group.members.length} members • Created by {group.createdBy?.username || 'Unknown'}
                </p>
              </div>
            </motion.div>

            <div className="flex space-x-3">
              <motion.button
                onClick={() => setShowAddExpense(true)}
                className="flex-1 md:flex-none px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/30 hover:shadow-xl transition-all flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>➕</span>
                <span>Add Bill</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Tab System */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft border border-primary-100/50 overflow-hidden">
          <div className="flex border-b border-primary-100/50">
            <button 
              onClick={() => setActiveTab('expenses')} 
              className={`flex-1 py-4 font-bold uppercase tracking-wider text-sm transition-all ${
                activeTab === 'expenses' 
                  ? 'text-primary-600 border-b-3 border-primary-500 bg-gradient-to-b from-primary-50/50 to-transparent' 
                  : 'text-primary-400 hover:text-primary-600 hover:bg-primary-50/30'
              }`}
            >
              📊 Expenses
            </button>
            <button 
              onClick={() => setActiveTab('chat')} 
              className={`flex-1 py-4 font-bold uppercase tracking-wider text-sm transition-all ${
                activeTab === 'chat' 
                  ? 'text-primary-600 border-b-3 border-primary-500 bg-gradient-to-b from-primary-50/50 to-transparent' 
                  : 'text-primary-400 hover:text-primary-600 hover:bg-primary-50/30'
              }`}
            >
              💬 Chat
            </button>
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'expenses' ? (
                <motion.div 
                  key="expenses"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  {group.expenses?.length > 0 ? (
                    group.expenses.map((expense, index) => {
                      const isFullySettled = expense.splits.every(s => s.isPaid);
                      const mySplit = expense.splits.find(s => (s.user?._id || s.user) === currentUser.id);
                      const iHavePaid = (expense.paidBy?._id === currentUser.id) || (mySplit?.isPaid);

                      return (
                        <motion.div 
                          key={expense._id} 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`border-2 rounded-2xl p-5 transition-all ${
                            isFullySettled 
                              ? 'bg-gradient-to-r from-emerald-50 to-emerald-50/50 border-emerald-200/50' 
                              : 'bg-white border-primary-100/50 shadow-soft hover:shadow-medium'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex gap-4">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm shadow-md ${
                                iHavePaid 
                                  ? 'bg-gradient-to-br from-emerald-400 to-emerald-500 text-white' 
                                  : 'bg-gradient-to-br from-red-400 to-red-500 text-white'
                              }`}>
                                {expense.paidBy?.username ? expense.paidBy.username[0].toUpperCase() : '?'}
                              </div>
                              <div>
                                <h3 className="font-display font-bold text-primary-800 text-lg">{expense.description}</h3>
                                <p className="text-sm text-primary-600/70">Paid by {expense.paidBy?.username || 'Unknown'}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`text-xl font-display font-bold ${isFullySettled ? 'text-emerald-500' : 'text-primary-800'}`}>
                                ₹{expense.amount.toFixed(2)}
                              </span>
                              {!isFullySettled && !iHavePaid && mySplit && (
                                <div className="mt-2 flex flex-col items-end">
                                  <p className="text-sm font-bold text-red-500 uppercase">● YOU OWE: ₹{mySplit.amount.toFixed(2)}</p>
                                  <motion.button 
                                    onClick={() => { 
                                      setSelectedPayment({ 
                                        paidTo: expense.paidBy._id, 
                                        userName: expense.paidBy.username, 
                                        groupId: id, 
                                        expenseId: expense._id, 
                                        billName: expense.description, 
                                        amountOwed: mySplit.amount 
                                      }); 
                                      setShowPaymentModal(true); 
                                    }} 
                                    className="mt-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-400 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                  >
                                    Pay This Bill
                                  </motion.button>
                                </div>
                              )}
                              {isFullySettled && (
                                <p className="text-xs font-bold text-emerald-500 uppercase mt-1 flex items-center justify-end gap-1">
                                  <span>✓</span> Completed
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="mt-4 flex flex-wrap gap-2 pt-4 border-t border-primary-50">
                            {expense.splits.map(split => (
                              <span 
                                key={split.user?._id || split.user} 
                                className={`text-xs px-3 py-1.5 rounded-full font-semibold border ${
                                  split.isPaid || (expense.paidBy?._id === (split.user?._id || split.user)) 
                                    ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                                    : 'bg-red-50 text-red-600 border-red-100'
                                }`}
                              >
                                {split.user?.username || 'User'}: ₹{split.amount.toFixed(2)} 
                                {(split.isPaid || (expense.paidBy?._id === (split.user?._id || split.user))) && ' ✓'}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      );
                    })
                  ) : (
                    <div className="text-center py-16">
                      <motion.span 
                        className="text-6xl block mb-4"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        📊
                      </motion.span>
                      <p className="text-primary-600/70 font-medium">No expenses yet. Add your first bill!</p>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <GroupChat groupId={id} members={group.members} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showGroupInfo && (
          <GroupInfoModal 
            group={group} 
            onClose={() => setShowGroupInfo(false)} 
            onInviteClick={() => setShowInviteModal(true)} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddExpense && (
          <AddExpenseModal 
            groupId={id} 
            members={group.members} 
            onClose={() => setShowAddExpense(false)} 
            onSuccess={() => { setShowAddExpense(false); fetchGroupDetails(); }} 
          />
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {showInviteModal && (
          <InviteUserModal 
            group={group} 
            onClose={() => setShowInviteModal(false)} 
            onSuccess={() => { setShowInviteModal(false); fetchGroupDetails(); }} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPaymentModal && selectedPayment && (
          <PaymentModal 
            payment={selectedPayment} 
            onClose={() => { setShowPaymentModal(false); setSelectedPayment(null); }} 
            onSuccess={() => { setShowPaymentModal(false); setSelectedPayment(null); fetchGroupDetails(); }} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default GroupDetails;
