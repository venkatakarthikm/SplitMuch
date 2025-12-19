import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const PaymentModal = ({ payment, onClose, onSuccess }) => {
  const [amount, setAmount] = useState(payment.amountOwed || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const paymentAmount = parseFloat(amount);
    if (isNaN(paymentAmount) || paymentAmount <= 0) { toast.error('Please enter a valid amount'); return; }
    setLoading(true);
    try {
      await api.post('/payments', { paidTo: payment.paidTo, amount: paymentAmount, groupId: payment.groupId, expenseId: payment.expenseId || null });
      toast.success('Payment recorded successfully!');
      onSuccess();
    } catch (error) { toast.error(error.response?.data?.message || 'Failed to record payment'); } 
    finally { setLoading(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="bg-white rounded-3xl shadow-large max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-display font-bold text-primary-800">Record Payment</h2>
          <button onClick={onClose} className="text-primary-400 hover:text-primary-600 text-2xl">×</button>
        </div>
        {payment.billName && (
          <div className="mb-6 p-4 bg-gradient-to-r from-primary-50 to-accent-light/30 border border-primary-100 rounded-2xl">
            <p className="text-xs text-primary-500 font-bold uppercase tracking-widest mb-1">Settling Bill</p>
            <p className="text-lg font-display font-bold text-primary-800">{payment.billName}</p>
            <div className="mt-2 flex justify-between items-center border-t border-primary-100/50 pt-2">
              <span className="text-sm text-primary-600/70">To: <strong>{payment.userName}</strong></span>
              <span className="text-sm font-bold text-red-500">Due: ₹{payment.amountOwed?.toFixed(2)}</span>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <span className="absolute left-4 top-3.5 text-primary-400 font-bold text-lg">₹</span>
            <input type="number" step="0.01" required value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full pl-9 pr-4 py-3 bg-primary-50/50 border-2 border-primary-100 rounded-xl focus:ring-2 focus:ring-primary-500/50 font-bold text-lg text-primary-800 outline-none transition-all" placeholder="0.00" />
            <p className="text-xs text-primary-500/60 mt-2 italic">Partial payments will reduce your debt balance.</p>
          </div>
          <div className="flex space-x-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 border-2 border-primary-200 rounded-xl font-semibold text-primary-600 hover:bg-primary-50 transition-all">Cancel</button>
            <motion.button type="submit" disabled={loading} className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white rounded-xl font-bold shadow-md hover:shadow-lg disabled:opacity-50 transition-all" whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.98 }}>{loading ? 'Processing...' : 'Confirm'}</motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default PaymentModal;
