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

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#1c1e21]">Groups</h1>
            <p className="text-[#65676b] text-sm">Manage and track your shared expense groups</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-[#1877f2] hover:bg-[#166fe5] text-white px-6 py-2.5 rounded-lg font-bold shadow-sm transition-all flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Create New Group</span>
          </button>
        </div>

        {/* Pending Invitations - Clean UI */}
        <AnimatePresence>
          {pendingInvites.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-8 bg-blue-50 border border-blue-200 rounded-xl p-4"
            >
              <h2 className="text-sm font-bold text-blue-700 uppercase tracking-wider mb-4 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                Pending Invitations ({pendingInvites.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {pendingInvites.map((invite) => (
                  <div key={invite.groupId} className="bg-white p-4 rounded-lg border border-blue-100 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-800 text-sm">{invite.groupName}</p>
                      <p className="text-xs text-gray-500">From {invite.invitedBy?.username}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button onClick={() => handleRespondToInvite(invite.groupId, true)} className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-md font-bold">Accept</button>
                      <button onClick={() => handleRespondToInvite(invite.groupId, false)} className="text-xs bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md font-bold">Decline</button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Groups List */}
        {loading ? (
          <ListSkeleton count={4} />
        ) : groups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map((group) => (
              <div key={group._id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:border-blue-300 transition-all overflow-hidden flex flex-col">
                <div className="p-5 flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-[#1c1e21] leading-tight">{group.name}</h3>
                    <div className="text-gray-400">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                  
                  {group.description && (
                    <p className="text-sm text-[#65676b] mb-4 line-clamp-2">{group.description}</p>
                  )}

                  <div className="flex items-center space-x-4 text-xs font-semibold text-gray-500 mb-4">
                    <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5"></span>{group.members.length} Members</span>
                    <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>{group.expenses?.length || 0} Bills</span>
                  </div>

                  <div className="flex -space-x-2 mb-2">
                    {group.members.slice(0, 5).map((member) => (
                      <div key={member.user._id} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600 shadow-sm" title={member.user.username}>
                        {member.user.username[0].toUpperCase()}
                      </div>
                    ))}
                    {group.members.length > 5 && (
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-50 flex items-center justify-center text-[10px] font-bold text-gray-400">
                        +{group.members.length - 5}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-2">
                  <Link
                    to={`/groups/${group._id}`}
                    className="flex-1 text-center bg-white border border-gray-300 hover:bg-gray-50 text-[#1c1e21] py-2 rounded-lg font-bold text-sm transition-all"
                  >
                    View Group
                  </Link>
                  <button
                    onClick={() => { setSelectedGroup(group); setShowInviteModal(true); }}
                    className="p-2 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg text-gray-600"
                    title="Invite Member"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#1c1e21] mb-2">No groups yet</h3>
            <p className="text-[#65676b] mb-6">Create a group to start sharing expenses with friends.</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-[#1877f2] text-white px-8 py-2.5 rounded-lg font-bold shadow-sm"
            >
              Get Started
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateGroupModal
            onClose={() => setShowCreateModal(false)}
            onSuccess={() => { setShowCreateModal(false); fetchGroups(); }}
          />
        )}
        {showInviteModal && selectedGroup && (
          <InviteUserModal
            group={selectedGroup}
            onClose={() => { setShowInviteModal(false); setSelectedGroup(null); }}
            onSuccess={() => { setShowInviteModal(false); setSelectedGroup(null); fetchGroups(); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Groups;