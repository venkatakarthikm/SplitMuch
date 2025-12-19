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
        toast.error(error.response?.data?.message || 'Failed to join group');
      }
    } else if (notification.relatedGroup) {
      navigate(`/groups/${notification.relatedGroup._id}`);
    }
  };

  const getNotificationIcon = (type, isRead) => {
    const colorClass = isRead ? "text-gray-400" : "text-blue-600";
    const bgClass = isRead ? "bg-gray-100" : "bg-blue-100";

    const icons = {
      'GROUP_INVITE': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
      'EXPENSE_ADDED': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      'PAYMENT_RECEIVED': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      'DEFAULT': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      )
    };

    return (
      <div className={`w-10 h-10 ${bgClass} ${colorClass} rounded-full flex items-center justify-center flex-shrink-0`}>
        {icons[type] || icons['DEFAULT']}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#1c1e21]">Notifications</h1>
            <p className="text-[#65676b] text-sm">Updates from your groups and expenses</p>
          </div>
          {notifications.some(n => !n.isRead) && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-[#1877f2] hover:bg-blue-50 px-3 py-2 rounded-lg font-semibold text-sm transition-colors"
            >
              Mark all as read
            </button>
          )}
        </div>

        {loading ? (
          <ListSkeleton count={5} />
        ) : notifications.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-4 flex items-start space-x-3 hover:bg-gray-50 transition-colors cursor-pointer relative group ${
                    !notification.isRead ? 'bg-blue-50/40' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  {/* Unread Indicator Dot */}
                  {!notification.isRead && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-600 rounded-full"></div>
                  )}

                  {getNotificationIcon(notification.type, notification.isRead)}

                  <div className="flex-1 pr-8">
                    <p className={`text-sm leading-snug ${!notification.isRead ? 'font-bold text-[#1c1e21]' : 'text-[#65676b]'}`}>
                      {notification.message}
                    </p>
                    <div className="flex items-center mt-1 space-x-2">
                      <span className="text-[12px] text-blue-600 font-semibold">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </span>
                      {notification.relatedGroup && (
                        <>
                          <span className="text-gray-300">·</span>
                          <span className="text-[12px] text-gray-500 font-medium">
                            {notification.relatedGroup.name}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Options Button (Visible on Hover) */}
                  <div className="hidden group-hover:flex items-center space-x-1">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDelete(notification._id); }}
                      className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
                      title="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.pages > 1 && (
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                  disabled={pagination.page === 1}
                  className="text-sm font-bold text-gray-600 disabled:text-gray-300"
                >
                  Previous
                </button>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                  disabled={pagination.page === pagination.pages}
                  className="text-sm font-bold text-[#1877f2] disabled:text-gray-300"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-16 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-[#1c1e21]">No notifications</h3>
            <p className="text-[#65676b] text-sm">You're all caught up for now!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;