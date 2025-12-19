import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const AddExpenseModal = ({ groupId, members, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({ description: '', amount: '', splitType: 'EQUAL', note: '' });
  const [selectedMembers, setSelectedMembers] = useState(members.map(m => m.user._id));
  const [exactSplits, setExactSplits] = useState({});
  const [percentageSplits, setPercentageSplits] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleMemberToggle = (memberId) => setSelectedMembers(prev => prev.includes(memberId) ? prev.filter(id => id !== memberId) : [...prev, memberId]);

  const validateAndSubmit = async (e) => {
    e.preventDefault();
    if (selectedMembers.length === 0) { toast.error('Please select at least one member'); return; }
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) { toast.error('Please enter a valid amount'); return; }

    let splits = [];
    if (formData.splitType === 'EQUAL') splits = selectedMembers;
    else if (formData.splitType === 'EXACT') {
      const total = selectedMembers.reduce((sum, id) => sum + (exactSplits[id] || 0), 0);
      if (Math.abs(total - amount) > 0.01) { toast.error(`Split amounts must equal ${amount.toFixed(2)}.`); return; }
      splits = selectedMembers.map(id => ({ user: id, amount: exactSplits[id] || 0 }));
    } else if (formData.splitType === 'PERCENTAGE') {
      const totalPercentage = selectedMembers.reduce((sum, id) => sum + (percentageSplits[id] || 0), 0);
      if (Math.abs(totalPercentage - 100) > 0.01) { toast.error('Percentages must sum to 100%.'); return; }
      splits = selectedMembers.map(id => ({ user: id, percentage: percentageSplits[id] || 0 }));
    }

    setLoading(true);
    try {
      await api.post('/expenses', { description: formData.description, amount, groupId, splitType: formData.splitType, splits, note: formData.note });
      toast.success('Expense added successfully!');
      onSuccess();
    } catch (error) { toast.error(error.response?.data?.message || 'Failed to add expense'); } 
    finally { setLoading(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="bg-white rounded-3xl shadow-large max-w-2xl w-full p-6 my-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-bold text-primary-800">Add Expense</h2>
          <button onClick={onClose} className="text-primary-400 hover:text-primary-600 text-2xl">×</button>
        </div>
        <form onSubmit={validateAndSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-primary-700 mb-2">Description *</label>
              <input name="description" type="text" required value={formData.description} onChange={handleChange} className="w-full px-4 py-3 bg-primary-50/50 border-2 border-primary-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium text-primary-800" placeholder="e.g., Dinner at restaurant" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary-700 mb-2">Amount *</label>
              <input name="amount" type="number" step="0.01" min="0.01" required value={formData.amount} onChange={handleChange} className="w-full px-4 py-3 bg-primary-50/50 border-2 border-primary-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium text-primary-800" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary-700 mb-2">Split Type *</label>
              <select name="splitType" value={formData.splitType} onChange={handleChange} className="w-full px-4 py-3 bg-primary-50/50 border-2 border-primary-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium text-primary-800">
                <option value="EQUAL">Equal Split</option>
                <option value="EXACT">Exact Amount</option>
                <option value="PERCENTAGE">Percentage</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-primary-700 mb-3">Split with members *</label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
              {members.map((member) => (
                <div key={member.user._id} className="flex items-center space-x-3 p-3 bg-primary-50/50 rounded-xl border border-primary-100/50">
                  <input type="checkbox" checked={selectedMembers.includes(member.user._id)} onChange={() => handleMemberToggle(member.user._id)} className="w-5 h-5 text-primary-500 rounded focus:ring-2 focus:ring-primary-500" />
                  <div className="flex-1"><p className="font-medium text-primary-800">{member.user.username}</p></div>
                  {selectedMembers.includes(member.user._id) && formData.splitType === 'EXACT' && (
                    <input type="number" step="0.01" min="0" placeholder="Amount" value={exactSplits[member.user._id] || ''} onChange={(e) => setExactSplits({ ...exactSplits, [member.user._id]: parseFloat(e.target.value) || 0 })} className="w-24 px-2 py-1 border-2 border-primary-200 rounded-lg text-sm" />
                  )}
                  {selectedMembers.includes(member.user._id) && formData.splitType === 'PERCENTAGE' && (
                    <input type="number" step="0.1" min="0" max="100" placeholder="%" value={percentageSplits[member.user._id] || ''} onChange={(e) => setPercentageSplits({ ...percentageSplits, [member.user._id]: parseFloat(e.target.value) || 0 })} className="w-20 px-2 py-1 border-2 border-primary-200 rounded-lg text-sm" />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex space-x-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 border-2 border-primary-200 text-primary-600 rounded-xl font-semibold hover:bg-primary-50 transition-all">Cancel</button>
            <motion.button type="submit" disabled={loading} className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50" whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.98 }}>{loading ? 'Adding...' : 'Add Expense'}</motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AddExpenseModal;
