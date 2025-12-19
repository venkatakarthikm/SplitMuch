import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const CreateGroupModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) { toast.error('Group name is required'); return; }
    setLoading(true);
    try {
      await api.post('/groups', formData);
      toast.success('Group created successfully!');
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create group');
    } finally { setLoading(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-white rounded-3xl shadow-large max-w-md w-full p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-bold text-primary-800">Create New Group</h2>
          <button onClick={onClose} className="text-primary-400 hover:text-primary-600 text-2xl transition-colors">×</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-primary-700 mb-2">Group Name *</label>
            <input name="name" type="text" required value={formData.name} onChange={handleChange} className="w-full px-4 py-3 bg-primary-50/50 border-2 border-primary-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-400 transition-all font-medium text-primary-800" placeholder="e.g., Room Rent, Trip to Goa" maxLength="50" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-primary-700 mb-2">Description (Optional)</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="w-full px-4 py-3 bg-primary-50/50 border-2 border-primary-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-400 transition-all font-medium text-primary-800 resize-none" placeholder="Add a description..." rows="3" maxLength="200" />
            <p className="text-xs text-primary-500/60 mt-1">{formData.description.length}/200 characters</p>
          </div>
          <div className="flex space-x-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 border-2 border-primary-200 text-primary-600 rounded-xl font-semibold hover:bg-primary-50 transition-all">Cancel</button>
            <motion.button type="submit" disabled={loading} className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-400 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50" whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.98 }}>{loading ? 'Creating...' : 'Create Group'}</motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default CreateGroupModal;
