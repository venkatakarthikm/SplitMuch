import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const InviteUserModal = ({ group, onClose, onSuccess }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length < 2) { setSearchResults([]); return; }
    setSearching(true);
    try {
      const response = await api.get(`/users/search?query=${query}`);
      const memberIds = group.members.map(m => m.user._id);
      setSearchResults(response.data.data.filter(user => !memberIds.includes(user._id)));
    } catch (error) { toast.error('Failed to search users'); } 
    finally { setSearching(false); }
  };

  const handleInvite = async (userId) => {
    setLoading(true);
    try {
      await api.post(`/groups/${group._id}/invite`, { userId });
      toast.success('Invitation sent successfully!');
      onSuccess();
    } catch (error) { toast.error(error.response?.data?.message || 'Failed to send invitation'); } 
    finally { setLoading(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="bg-white rounded-3xl shadow-large max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-bold text-primary-800">Invite User</h2>
          <button onClick={onClose} className="text-primary-400 hover:text-primary-600 text-2xl">×</button>
        </div>
        <div className="mb-4">
          <p className="text-sm text-primary-600/70 mb-3">Inviting to: <span className="font-semibold text-primary-700">{group.name}</span></p>
          <input type="text" value={searchQuery} onChange={(e) => handleSearch(e.target.value)} className="w-full px-4 py-3 bg-primary-50/50 border-2 border-primary-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium text-primary-800" placeholder="Search by username, email, or phone..." />
        </div>
        <div className="max-h-72 overflow-y-auto">
          {searching ? (
            <div className="text-center py-8"><motion.div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-2" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} /><p className="text-primary-600/70">Searching...</p></div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-2">
              {searchResults.map((user) => (
                <div key={user._id} className="flex items-center justify-between p-3 bg-primary-50/50 rounded-xl border border-primary-100/50 hover:shadow-soft transition-all">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">{user.username[0].toUpperCase()}</div>
                    <div><p className="font-semibold text-primary-800">{user.username}</p><p className="text-sm text-primary-600/70">{user.email}</p></div>
                  </div>
                  <motion.button onClick={() => handleInvite(user._id)} disabled={loading} className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-400 text-white rounded-xl font-medium text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Invite</motion.button>
                </div>
              ))}
            </div>
          ) : searchQuery.length >= 2 ? (
            <div className="text-center py-8 text-primary-600/70">No users found</div>
          ) : (
            <div className="text-center py-8 text-primary-600/70">Start typing to search for users</div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default InviteUserModal;
