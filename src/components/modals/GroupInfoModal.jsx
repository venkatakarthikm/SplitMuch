import React from 'react';
import { motion } from 'framer-motion';

const GroupInfoModal = ({ group, onClose, onInviteClick }) => {
  if (!group) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-white rounded-3xl shadow-large max-w-md w-full overflow-hidden">
        <div className="bg-gradient-to-r from-primary-500 to-primary-400 p-6 text-white flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">👥</div>
            <div>
              <h2 className="text-xl font-display font-bold">{group.name}</h2>
              <p className="text-xs opacity-80 uppercase tracking-widest font-bold">Group Info</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white text-2xl font-bold">×</button>
        </div>
        <div className="p-6 space-y-6">
          <section>
            <h3 className="text-xs font-bold text-primary-400 uppercase tracking-wider mb-2">Description</h3>
            <p className="text-primary-700 text-sm leading-relaxed">{group.description || 'No description provided.'}</p>
          </section>
          <section>
            <motion.button onClick={() => { onClose(); onInviteClick(); }} className="w-full py-3 bg-gradient-to-r from-primary-50 to-accent-light/30 text-primary-600 rounded-xl font-bold border border-primary-100 hover:shadow-soft transition-all flex items-center justify-center space-x-2" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <span>👤➕</span><span>Invite New Members</span>
            </motion.button>
          </section>
          <section>
            <h3 className="text-xs font-bold text-primary-400 uppercase tracking-wider mb-3">Group Members ({group.members.length})</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
              {group.members.map((member) => (
                <div key={member.user._id} className="flex items-center justify-between p-3 bg-primary-50/50 rounded-xl border border-primary-100/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-500 text-white rounded-lg flex items-center justify-center text-xs font-bold">{member.user.username[0].toUpperCase()}</div>
                    <span className="text-sm font-semibold text-primary-700">{member.user.username}</span>
                  </div>
                  {group.createdBy === member.user._id && <span className="text-[10px] bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full font-bold uppercase">Admin</span>}
                </div>
              ))}
            </div>
          </section>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GroupInfoModal;
