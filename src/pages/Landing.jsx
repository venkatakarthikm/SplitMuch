import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Landing = () => {
  const features = [
    {
      icon: '👥',
      title: 'Group Expenses',
      description: 'Create groups for trips, roommates, events, and more. Track shared expenses effortlessly.'
    },
    {
      icon: '💳',
      title: 'Smart Splitting',
      description: 'Split bills equally, by percentage, or exact amounts. Flexible options for every situation.'
    },
    {
      icon: '📊',
      title: 'Real-time Tracking',
      description: 'See who owes what instantly. No more confusion or awkward money conversations.'
    },
    {
      icon: '🔔',
      title: 'Instant Notifications',
      description: 'Get notified when expenses are added or payments are made. Stay in the loop.'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary-400/30 to-accent-light/40 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0]
            }}
            transition={{ duration: 20, repeat: Infinity }}
          />
          <motion.div 
            className="absolute top-1/2 -left-40 w-80 h-80 bg-gradient-to-br from-accent-mint/40 to-primary-300/30 rounded-full blur-3xl"
            animate={{ 
              scale: [1.2, 1, 1.2],
              rotate: [90, 0, 90]
            }}
            transition={{ duration: 15, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-0 right-1/4 w-64 h-64 bg-gradient-to-br from-accent-light/30 to-accent-mint/30 rounded-full blur-3xl"
            animate={{ 
              y: [0, -30, 0]
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Logo */}
            <motion.div 
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-400 rounded-3xl shadow-large shadow-primary-500/40 mb-8"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            >
              <span className="text-4xl">💰</span>
            </motion.div>

            <motion.h1 
              className="text-5xl md:text-7xl font-display font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400 bg-clip-text text-transparent">
                Split Expenses
              </span>
              <br />
              <span className="text-primary-800">Made Simple</span>
            </motion.h1>

            <motion.p 
              className="text-xl text-primary-600/80 max-w-2xl mx-auto mb-10 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Track shared expenses with friends, family, and roommates. 
              No more awkward money conversations — just simple, fair splitting.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Link to="/register">
                <motion.button
                  className="px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-400 text-white font-bold text-lg rounded-2xl shadow-large shadow-primary-500/40 hover:shadow-xl hover:shadow-primary-500/50 transition-all"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get Started Free
                </motion.button>
              </Link>
              <Link to="/login">
                <motion.button
                  className="px-8 py-4 bg-white/80 backdrop-blur-sm text-primary-600 font-bold text-lg rounded-2xl border-2 border-primary-200 hover:border-primary-300 hover:bg-white transition-all shadow-soft"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Sign In
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="mt-20 grid grid-cols-3 gap-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            {[
              { value: '10K+', label: 'Active Users' },
              { value: '50K+', label: 'Groups Created' },
              { value: '₹2Cr+', label: 'Expenses Tracked' }
            ].map((stat, index) => (
              <motion.div 
                key={stat.label}
                className="text-center"
                whileHover={{ y: -5 }}
              >
                <p className="text-3xl md:text-4xl font-display font-bold bg-gradient-to-r from-primary-500 to-accent-light bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-primary-600/70 mt-1 text-sm font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gradient-to-b from-transparent to-accent-mint/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-800 mb-4">
              Everything You Need
            </h2>
            <p className="text-primary-600/80 text-lg max-w-xl mx-auto">
              Powerful features to make expense sharing a breeze
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="group"
              >
                <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-primary-100/50 shadow-soft hover:shadow-large transition-all duration-300 h-full card-hover">
                  <motion.div 
                    className="w-16 h-16 bg-gradient-to-br from-primary-100 to-accent-light/50 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform shadow-soft"
                    whileHover={{ rotate: 10 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-xl font-display font-bold text-primary-800 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-primary-600/70 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl p-12 text-center relative overflow-hidden shadow-large"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-accent-light/20 rounded-full blur-2xl" />
            </div>

            <div className="relative z-10">
              <motion.span 
                className="text-6xl block mb-6"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🚀
              </motion.span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of users who are already splitting expenses effortlessly.
              </p>
              <Link to="/register">
                <motion.button
                  className="px-8 py-4 bg-white text-primary-600 font-bold text-lg rounded-2xl shadow-large hover:shadow-xl transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Create Free Account
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-10 border-t border-primary-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-400 rounded-lg flex items-center justify-center">
              <span className="text-sm">💰</span>
            </div>
            <span className="font-display font-bold text-primary-700">SplitMuch</span>
          </div>
          <p className="text-primary-600/60 text-sm">
            © 2025 SplitMuch.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
