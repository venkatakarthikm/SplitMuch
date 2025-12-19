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
    { path: '/dashboard', label: 'Dashboard'},
    { path: '/groups', label: 'Groups'},
    { path: '/history', label: 'History' },
    { path: '/notifications', label: 'Notifications', badge: unreadCount }
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-xl shadow-soft sticky top-0 z-40 border-b border-primary-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-3 group">
              <motion.div 
                className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-400 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30"
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-xl">💰</span>
              </motion.div>
              <span className="text-xl font-display font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                SplitMuch
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 rounded-xl transition-all duration-300 font-medium text-sm ${
                  isActive(link.path)
                    ? 'bg-gradient-to-r from-primary-500 to-primary-400 text-white shadow-lg shadow-primary-500/30'
                    : 'text-primary-700 hover:bg-primary-50'
                }`}
              >
                <span className="mr-2">{link.icon}</span>
                {link.label}
                {link.badge > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg"
                  >
                    {link.badge}
                  </motion.span>
                )}
              </Link>
            ))}
            <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-primary-100">
              <div className="flex items-center space-x-2 bg-primary-50 px-3 py-1.5 rounded-xl">
                <div className="w-7 h-7 bg-gradient-to-br from-primary-400 to-primary-500 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  {user?.username?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="text-sm font-medium text-primary-700">{user?.username || 'User'}</span>
              </div>
              <motion.button
                onClick={handleLogout}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-400 text-white rounded-xl font-medium text-sm shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Logout
              </motion.button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <motion.button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 text-primary-600 hover:bg-primary-50 rounded-xl transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {showMobileMenu ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-t border-primary-100/50"
          >
            <div className="px-4 pt-2 pb-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setShowMobileMenu(false)}
                  className={`relative block px-4 py-3 rounded-xl font-medium transition-all ${
                    isActive(link.path)
                      ? 'bg-gradient-to-r from-primary-500 to-primary-400 text-white shadow-lg'
                      : 'text-primary-700 hover:bg-primary-50'
                  }`}
                >
                  <span className="mr-3">{link.icon}</span>
                  {link.label}
                  {link.badge > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5 font-bold">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}
              <div className="pt-3 border-t border-primary-100">
                <div className="flex items-center space-x-3 px-4 py-2 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    {user?.username?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="font-medium text-primary-700">{user?.username || 'User'}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-red-400 text-white rounded-xl font-medium shadow-lg"
                >
                  Logout
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
