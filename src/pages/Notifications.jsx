import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { ListSkeleton } from '../components/common/SkeletonLoader';
import api from '../utils/api';

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });

  useEffect(() => {
    fetchNotifications();
  }, [pagination.page]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/notifications?page=${pagination.page}&limit=15`);
      setNotifications(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, isRead: true } : n
      ));
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(notifications.filter(n => n._id !== id));
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification._id);
    }

    if (notification.type === 'GROUP_INVITE' && notification.relatedGroup) {
      try {
        await api.post(`/groups/${notification.relatedGroup._id}/respond`, { accept: true });
        toast.success(`Successfully joined ${notification.relatedGroup.name}!`);
        navigate(`/groups/${notification.relatedGroup._id}`);
      } catch (error) {
        console.error("Join error:", error);
        toast.error(error.response?.data?.message || 'Failed to join group');
      }
    } else if (notification.relatedGroup) {
      navigate(`/groups/${notification.relatedGroup._id}`);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'GROUP_INVITE': return '📨';
      case 'EXPENSE_ADDED': return '💵';
      case 'PAYMENT_RECEIVED': return '💰';
      case 'PAYMENT_REMINDER': return '⏰';
      case 'EXPENSE_SETTLED': return '✅';
      default: return '🔔';
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold text-primary-800 mb-2">Notifications</h1>
              <p className="text-primary-600/70">Stay updated with your expenses</p>
            </div>
            {notifications.some(n => !n.isRead) && (
              <motion.button
                onClick={handleMarkAllAsRead}
                className="px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-400 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Mark All as Read
              </motion.button>
            )}
          </div>
        </motion.div>

        {loading ? (
          <ListSkeleton count={5} />
        ) : notifications.length > 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft border border-primary-100/50 overflow-hidden">
            <div className="divide-y divide-primary-100/50">
              {notifications.map((notification, index) => (
                <motion.div
                  key={notification._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-5 hover:bg-primary-50/50 transition-colors cursor-pointer ${
                    !notification.isRead ? 'bg-gradient-to-r from-primary-50/80 to-accent-light/20' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start space-x-4">
                    <motion.div 
                      className="text-3xl"
                      whileHover={{ scale: 1.1, rotate: 10 }}
                    >
                      {getNotificationIcon(notification.type)}
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className={`font-semibold ${
                            !notification.isRead ? 'text-primary-800' : 'text-primary-700'
                          }`}>
                            {notification.title}
                          </p>
                          <p className="text-sm text-primary-600/70 mt-1">{notification.message}</p>
                          {notification.relatedGroup && (
                            <p className="text-xs text-primary-500/60 mt-1.5 flex items-center gap-1">
                              <span>📁</span> {notification.relatedGroup.name}
                            </p>
                          )}
                          <p className="text-xs text-primary-400 mt-2">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.isRead && (
                            <motion.button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notification._id);
                              }}
                              className="p-2 text-primary-500 hover:bg-primary-100 rounded-xl transition-colors"
                              title="Mark as read"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              ✓
                            </motion.button>
                          )}
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(notification._id);
                            }}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                            title="Delete"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            🗑️
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="p-4 border-t border-primary-100/50 flex items-center justify-center space-x-3">
                <motion.button
                  onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                  disabled={pagination.page === 1}
                  className="px-5 py-2.5 bg-primary-50 text-primary-700 rounded-xl font-medium hover:bg-primary-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  whileHover={{ scale: pagination.page === 1 ? 1 : 1.02 }}
                >
                  Previous
                </motion.button>
                <span className="px-4 py-2 text-primary-700 font-medium">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <motion.button
                  onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                  disabled={pagination.page === pagination.pages}
                  className="px-5 py-2.5 bg-primary-50 text-primary-700 rounded-xl font-medium hover:bg-primary-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  whileHover={{ scale: pagination.page === pagination.pages ? 1 : 1.02 }}
                >
                  Next
                </motion.button>
              </div>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft border border-primary-100/50 p-12 text-center"
          >
            <motion.div 
              className="text-6xl mb-4"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🔔
            </motion.div>
            <h3 className="text-xl font-display font-bold text-primary-800 mb-2">No notifications</h3>
            <p className="text-primary-600/70">You're all caught up!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
