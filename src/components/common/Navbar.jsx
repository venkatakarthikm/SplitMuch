import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { clearStorage, getUser } from '../../utils/storage';
import api from '../../utils/api';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const userData = getUser();
    setUser(userData);
    fetchUnreadCount();
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const response = await api.get('/notifications');
      setUnreadCount(response.data.unreadCount || 0);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const handleLogout = () => {
    clearStorage();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const navLinks = [
    { 
      path: '/dashboard', 
      label: 'Dashboard', 
      icon: (active) => (
        <svg className={`w-6 h-6 ${active ? 'text-[#1877f2]' : 'text-[#65676b]'}`} fill={active ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
      )
    },
    { 
      path: '/groups', 
      label: 'Groups', 
      icon: (active) => (
        <svg className={`w-6 h-6 ${active ? 'text-[#1877f2]' : 'text-[#65676b]'}`} fill={active ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
      )
    },
    { 
      path: '/notifications', 
      label: 'Notifications', 
      badge: unreadCount,
      icon: (active) => (
        <svg className={`w-6 h-6 ${active ? 'text-[#1877f2]' : 'text-[#65676b]'}`} fill={active ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
      )
    }
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* --- DESKTOP VIEW (Classic/Old Style) --- */}
        <div className="hidden md:flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <img src="/splitmuch.png" alt="Logo" className="w-8 h-8 object-contain" />
              <span className="text-xl font-bold text-gray-800 tracking-tight">SplitMuch</span>
            </Link>
            
            <div className="flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-semibold transition-colors hover:text-emerald-500 ${
                    isActive(link.path) ? 'text-emerald-600' : 'text-gray-500'
                  }`}
                >
                  {link.label}
                  {link.badge > 0 && <span className="ml-1 text-xs text-red-500">({link.badge})</span>}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 border-r border-gray-200 pr-4">
              <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-gray-600 font-bold text-xs">
                {user?.username?.[0]?.toUpperCase()}
              </div>
              <span className="text-sm font-bold text-gray-700">{user?.username}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="text-sm font-semibold text-gray-500 hover:text-red-600 transition-colors"
            >
              Log out
            </button>
          </div>
        </div>

        {/* --- MOBILE VIEW (New Modern/Facebook Style) --- */}
        <div className="md:hidden flex justify-between items-center h-14">
          <Link to="/dashboard" className="w-10 h-10">
            <img src="/splitmuch.png" alt="Logo" className="w-full h-full object-contain" />
          </Link>

          <div className="flex flex-1 justify-center items-center h-full space-x-6">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link key={link.path} to={link.path} className="relative h-full flex items-center px-4">
                  {link.icon(active)}
                  {link.badge > 0 && (
                    <span className="absolute top-2 right-2 bg-[#fa3e3e] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold border border-white">
                      {link.badge}
                    </span>
                  )}
                  {active && <motion.div layoutId="mobileNav" className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#1877f2]" />}
                </Link>
              );
            })}
          </div>

          <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="p-2 bg-gray-100 rounded-full">
            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-[10px] font-bold">
              {user?.username?.[0]?.toUpperCase()}
            </div>
          </button>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 right-0 bg-white shadow-xl border-t border-gray-100 p-4 z-50"
          >
            <div className="flex items-center space-x-3 mb-6 p-2 bg-gray-50 rounded-lg">
               <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                 {user?.username?.[0]?.toUpperCase()}
               </div>
               <div>
                 <p className="font-bold text-gray-800">{user?.username}</p>
                 <p className="text-xs text-gray-500">View profile</p>
               </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 p-3 text-red-600 font-semibold hover:bg-red-50 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              <span>Log Out</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;