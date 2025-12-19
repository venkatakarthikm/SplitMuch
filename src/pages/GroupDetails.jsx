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
    <div className="min-h-screen bg-[#f0f2f5] pb-20">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div 
              className="flex items-center space-x-4 cursor-pointer"
              onClick={() => setShowGroupInfo(true)}
            >
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-2xl shadow-sm">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#1c1e21]">{group.name}</h1>
                <p className="text-[#65676b] text-sm font-medium">
                  {group.members.length} Members · Created by {group.createdBy?.username || 'Admin'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowAddExpense(true)}
              className="bg-[#1877f2] hover:bg-[#166fe5] text-white px-6 py-2 rounded-lg font-bold shadow-sm transition-all flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add Bill</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex border-b border-gray-100">
            {['expenses', 'chat'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-all ${
                  activeTab === tab ? 'text-[#1877f2]' : 'text-[#65676b] hover:bg-gray-50'
                }`}
              >
                {tab === 'expenses' ? 'Transactions' : 'Group Chat'}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#1877f2]"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="p-4 md:p-6 bg-gray-50/30">
            <AnimatePresence mode="wait">
              {activeTab === 'expenses' ? (
                <motion.div 
                  key="expenses"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  {group.expenses?.length > 0 ? (
                    group.expenses.map((expense) => {
                      const isFullySettled = expense.splits.every(s => s.isPaid);
                      const mySplit = expense.splits.find(s => (s.user?._id || s.user) === currentUser.id);
                      const iHavePaid = (expense.paidBy?._id === currentUser.id) || (mySplit?.isPaid);

                      return (
                        <div 
                          key={expense._id} 
                          className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-center space-x-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${
                                iHavePaid ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                              }`}>
                                {expense.paidBy?.username ? expense.paidBy.username[0].toUpperCase() : '?'}
                              </div>
                              <div>
                                <h3 className="font-bold text-[#1c1e21]">{expense.description}</h3>
                                <p className="text-xs text-[#65676b]">Paid by <span className="font-semibold">{expense.paidBy?.username}</span></p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`text-lg font-bold ${isFullySettled ? 'text-emerald-600' : 'text-[#1c1e21]'}`}>
                                ₹{expense.amount.toFixed(2)}
                              </p>
                              {!isFullySettled && !iHavePaid && mySplit && (
                                <button 
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
                                  className="mt-2 text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md font-bold transition-all"
                                >
                                  Settle ₹{mySplit.amount.toFixed(2)}
                                </button>
                              )}
                              {isFullySettled && (
                                <p className="text-[10px] font-bold text-emerald-600 uppercase mt-1">Selted</p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-400 text-sm">No expenses found in this group.</p>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <GroupChat groupId={id} members={group.members} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Modern Floating Chat Toggle */}
      <AnimatePresence>
        {activeTab === 'expenses' && (
          <div className="fixed bottom-6 right-6 z-50">
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              onClick={() => setActiveTab('chat')}
              className="w-14 h-14 bg-[#1877f2] text-white rounded-full shadow-xl flex items-center justify-center border-4 border-white"
            >
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zm-4 0H9v2h2V9z" clipRule="evenodd" />
              </svg>
            </motion.button>
          </div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {showGroupInfo && (
          <GroupInfoModal 
            group={group} 
            onClose={() => setShowGroupInfo(false)} 
            onInviteClick={() => setShowInviteModal(true)} 
          />
        )}
        {showAddExpense && (
          <AddExpenseModal 
            groupId={id} 
            members={group.members} 
            onClose={() => setShowAddExpense(false)} 
            onSuccess={() => { setShowAddExpense(false); fetchGroupDetails(); }} 
          />
        )}
        {showInviteModal && (
          <InviteUserModal 
            group={group} 
            onClose={() => setShowInviteModal(false)} 
            onSuccess={() => { setShowInviteModal(false); fetchGroupDetails(); }} 
          />
        )}
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