import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { saveToken, saveUser } from '../utils/storage';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const hasCalledApi = useRef(false);

  useEffect(() => {
    if (hasCalledApi.current) return;

    const verifyToken = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setStatus('error');
        return;
      }

      hasCalledApi.current = true;

      try {
        const response = await api.get(`/auth/verify-email?token=${token}`);
        
        if (response.data.success) {
          saveToken(response.data.token);
          saveUser(response.data.user);  
          
          setStatus('success');
          toast.success('Email Verified! Redirecting to dashboard...');
          
          setTimeout(() => navigate('/dashboard'), 3000);
        }
      } catch (error) {
        console.error('Verification Error:', error);
        setStatus('error');
        toast.error(error.response?.data?.message || 'Verification failed');
      }
    };

    verifyToken();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-primary-400/20 to-accent-light/30 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-br from-accent-mint/30 to-primary-300/20 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white/90 backdrop-blur-xl p-10 rounded-3xl shadow-large border border-primary-100/50 text-center relative z-10"
      >
        {status === 'verifying' && (
          <div className="space-y-6">
            <div className="relative">
              <motion.div 
                className="w-20 h-20 border-4 border-primary-100 rounded-full mx-auto"
                style={{ borderTopColor: '#3674B5', borderRightColor: '#578FCA' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-accent-light/30 to-accent-mint/30 blur-sm mx-auto" style={{ width: 48, height: 48, margin: 'auto', top: 0, bottom: 0, left: 0, right: 0 }} />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-primary-800">Verifying Account</h2>
              <p className="text-primary-600/70 mt-2">Connecting to SplitMuch servers...</p>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-6">
            <motion.div 
              className="text-6xl"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              ✅
            </motion.div>
            <div>
              <h2 className="text-2xl font-display font-bold text-emerald-600">Successfully Verified!</h2>
              <p className="text-primary-600/70 mt-2">Setting up your secure session...</p>
              <p className="text-sm text-primary-500/60 mt-4 italic">Redirecting in a few seconds</p>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-6">
            <motion.div 
              className="text-6xl"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              ❌
            </motion.div>
            <div>
              <h2 className="text-2xl font-display font-bold text-red-500">Verification Failed</h2>
              <p className="text-primary-600/70 mt-2">The link is either invalid or has expired.</p>
            </div>
            <motion.button 
              onClick={() => navigate('/register')}
              className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-400 text-white rounded-xl font-bold shadow-large shadow-primary-500/40 hover:shadow-xl transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Try Registering Again
            </motion.button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
