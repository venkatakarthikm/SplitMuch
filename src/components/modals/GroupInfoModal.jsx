import React from 'react';
import { motion } from 'framer-motion';

const GroupInfoModal = ({ group, onClose, onInviteClick }) => {
  if (!group) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        exit={{ opacity: 0, scale: 0.95, y: 10 }} 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
      >
        {/* Modern Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center space-x-3">
            <div className="text-gray-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-[#1c1e21]">{group.name} Info</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Description Section */}
          <section>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Description</h3>
            <p className="text-[#1c1e21] text-sm leading-relaxed">
              {group.description || 'No description provided for this group.'}
            </p>
          </section>

          {/* Action Button */}
          <section>
            <button 
              onClick={() => { onClose(); onInviteClick(); }} 
              className="w-full py-2.5 bg-[#1877f2] hover:bg-[#166fe5] text-white rounded-lg font-bold text-sm shadow-sm transition-all flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <span>Invite New Members</span>
            </button>
          </section>

          {/* Members Section */}
          <section>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
              Group Members ({group.members.length})
            </h3>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
              {group.members.map((member) => (
                <div 
                  key={member.user._id} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-xs font-bold">
                      {member.user.username[0].toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-[#1c1e21]">{member.user.username}</span>
                  </div>
                  {/* Checking admin status */}
                  {(group.createdBy?._id === member.user._id || group.createdBy === member.user._id) && (
                    <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-md font-bold uppercase">
                      Admin
                    </span>
                  )}
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