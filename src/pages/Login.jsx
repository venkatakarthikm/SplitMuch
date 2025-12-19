import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { saveToken, saveUser } from '../utils/storage';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.identifier || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/login', formData);
      
      if (response.data.success) {
        saveToken(response.data.token);
        saveUser(response.data.user);
        toast.success('Login successful!');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-400/20 to-accent-light/30 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div 
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-accent-mint/30 to-primary-300/20 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], rotate: [45, 0, 45] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-large border border-primary-100/50 p-8 md:p-10">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-400 rounded-2xl shadow-large shadow-primary-500/40 mb-6"
            >
              <span className="text-4xl">💰</span>
            </motion.div>
            <h2 className="text-3xl font-display font-bold text-primary-800">Welcome Back!</h2>
            <p className="mt-2 text-primary-600/70">Sign in to manage your expenses</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="identifier" className="block text-sm font-semibold text-primary-700 mb-2">
                Email, Username or Phone
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                id="identifier"
                name="identifier"
                type="text"
                required
                value={formData.identifier}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-primary-50/50 border-2 border-primary-100 placeholder-primary-400 text-primary-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-400 transition-all font-medium"
                placeholder="Enter your email, username or phone"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-primary-700 mb-2">
                Password
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-primary-50/50 border-2 border-primary-100 placeholder-primary-400 text-primary-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-400 transition-all font-medium"
                placeholder="Enter your password"
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-400 text-white font-bold rounded-xl shadow-large shadow-primary-500/40 hover:shadow-xl hover:shadow-primary-500/50 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <motion.div 
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-primary-600/70">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-bold text-primary-500 hover:text-primary-600 transition-colors"
              >
                Sign up now
              </Link>
            </p>
          </div>
        </div>

        <motion.div 
          className="text-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Link to="/" className="text-primary-500 hover:text-primary-600 font-medium text-sm transition-colors">
            ← Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
