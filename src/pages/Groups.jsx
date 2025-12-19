import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import Navbar from '../components/common/Navbar';
import { ListSkeleton } from '../components/common/SkeletonLoader';
import CreateGroupModal from '../components/modals/CreateGroupModal';
import InviteUserModal from '../components/modals/InviteUserModal';
import api from '../utils/api';
import { getUser } from '../utils/storage';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [pendingInvites, setPendingInvites] = useState([]);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await api.get('/groups');
      const groupsData = response.data.data || [];
      setGroups(groupsData);

      const user = getUser();
      const currentUserId = user?.id || user?._id;

      const invites = [];
      groupsData.forEach(group => {
        if (group.pendingInvites) {
          const userPendingInvite = group.pendingInvites.find(
            invite => (invite.user?._id === currentUserId || invite.user === currentUserId)
          );
          if (userPendingInvite) {
            invites.push({
              ...userPendingInvite,
              groupId: group._id,
              groupName: group.name
            });
          }
        }
      });
      setPendingInvites(invites);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch groups');
    } finally {
      setLoading(false);
    }
  };

  const handleRespondToInvite = async (groupId, accept) => {
    try {
      await api.post(`/groups/${groupId}/respond`, { accept });
      toast.success(accept ? 'Invitation accepted!' : 'Invitation declined');
      fetchGroups();
    } catch (error) {
      toast.error('Failed to respond to invitation');
    }
  };

  const handleInviteUser = (group) => {
    setSelectedGroup(group);
    setShowInviteModal(true);
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
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold text-primary-800 mb-2">Groups</h1>
              <p className="text-primary-600/70">Manage your expense groups</p>
            </div>
            <motion.button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-400 text-white rounded-xl font-bold shadow-large shadow-primary-500/30 hover:shadow-xl transition-all flex items-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-xl">+</span>
              <span>Create Group</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Pending Invitations */}
        <AnimatePresence>
          {pendingInvites.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200/50 rounded-3xl p-6"
            >
              <h2 className="text-lg font-display font-bold text-amber-800 mb-4 flex items-center">
                <span className="mr-2">📨</span>
                Pending Invitations ({pendingInvites.length})
              </h2>
              <div className="space-y-3">
                {pendingInvites.map((invite) => (
                  <motion.div
                    key={invite.groupId}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-between shadow-soft border border-amber-100/50"
                    layout
                  >
                    <div>
                      <p className="font-semibold text-primary-800">{invite.groupName}</p>
                      <p className="text-sm text-primary-600/70">
                        Invited by {invite.invitedBy?.username}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <motion.button
                        onClick={() => handleRespondToInvite(invite.groupId, true)}
                        className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Accept
                      </motion.button>
                      <motion.button
                        onClick={() => handleRespondToInvite(invite.groupId, false)}
                        className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-400 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Decline
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Groups List */}
        {loading ? (
          <ListSkeleton count={4} />
        ) : groups.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {groups.map((group, index) => (
              <motion.div
                key={group._id}
                variants={itemVariants}
                className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft border border-primary-100/50 overflow-hidden card-hover group"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-display font-bold text-primary-800 mb-2 group-hover:text-primary-600 transition-colors">
                        {group.name}
                      </h3>
                      {group.description && (
                        <p className="text-sm text-primary-600/70 mb-3 line-clamp-2">{group.description}</p>
                      )}
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-accent-light/50 rounded-2xl flex items-center justify-center text-2xl shadow-soft">
                      👥
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-primary-600/70 mb-4">
                    <span className="flex items-center gap-1">
                      <span>👤</span> {group.members.length} members
                    </span>
                    <span className="flex items-center gap-1">
                      <span>📊</span> {group.expenses?.length || 0} expenses
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 mb-5">
                    <div className="flex -space-x-2">
                      {group.members.slice(0, 4).map((member) => (
                        <div
                          key={member.user._id}
                          className="w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-500 rounded-xl flex items-center justify-center border-2 border-white text-xs font-bold text-white shadow-sm"
                          title={member.user.username}
                        >
                          {member.user.username[0].toUpperCase()}
                        </div>
                      ))}
                      {group.members.length > 4 && (
                        <div className="w-9 h-9 bg-primary-100 rounded-xl flex items-center justify-center border-2 border-white text-xs font-bold text-primary-600">
                          +{group.members.length - 4}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Link
                      to={`/groups/${group._id}`}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-400 text-white rounded-xl font-semibold text-center shadow-md hover:shadow-lg transition-all"
                    >
                      View Details
                    </Link>
                    <motion.button
                      onClick={() => handleInviteUser(group)}
                      className="px-4 py-3 bg-primary-50 text-primary-600 rounded-xl font-semibold hover:bg-primary-100 transition-all"
                      title="Invite User"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      ➕
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white/60 backdrop-blur-sm rounded-3xl border border-primary-100/50"
          >
            <motion.div 
              className="text-7xl mb-4"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              👥
            </motion.div>
            <h3 className="text-xl font-display font-bold text-primary-800 mb-2">No groups yet</h3>
            <p className="text-primary-600/70 mb-6">Create your first group to start splitting expenses</p>
            <motion.button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-400 text-white rounded-xl font-bold shadow-large hover:shadow-xl transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Create Your First Group
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateGroupModal
            onClose={() => setShowCreateModal(false)}
            onSuccess={() => {
              setShowCreateModal(false);
              fetchGroups();
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showInviteModal && selectedGroup && (
          <InviteUserModal
            group={selectedGroup}
            onClose={() => {
              setShowInviteModal(false);
              setSelectedGroup(null);
            }}
            onSuccess={() => {
              setShowInviteModal(false);
              setSelectedGroup(null);
              fetchGroups();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Groups;
