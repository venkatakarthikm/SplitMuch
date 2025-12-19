import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import api from "../utils/api";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the validation errors");
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...userData } = formData;
      const response = await api.post("/auth/register", userData);

      if (response.data.success) {
        setIsSubmitted(true);
        toast.success(response.data.message || "Verification email sent!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // Verification View
  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-primary-400/20 to-accent-light/30 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white/90 backdrop-blur-xl p-10 rounded-3xl shadow-large border border-primary-100/50 text-center relative z-10"
        >
          <motion.div
            className="text-7xl mb-6"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            📧
          </motion.div>
          <h2 className="text-3xl font-display font-bold text-primary-800 mb-4">
            Verify Your Email
          </h2>
          <p className="text-primary-600/80 mb-8 leading-relaxed">
            A verification link has been sent to <br />
            <span className="font-bold text-primary-500">{formData.email}</span>
            . <br />
            Please check your inbox to activate your account.
          </p>
          <div className="space-y-4">
            <motion.button
              onClick={() => navigate("/login")}
              className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-400 text-white rounded-xl font-bold shadow-large shadow-primary-500/40 hover:shadow-xl transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Go to Login Page
            </motion.button>
            <p className="text-sm text-primary-500/70">
              Didn't receive the email? Check your spam folder.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Registration Form
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-accent-light/30 to-primary-300/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], rotate: [0, -45, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-400/20 to-accent-mint/30 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], rotate: [-45, 0, -45] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-large border border-primary-100/50 p-8">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 from-primary-500 to-primary-400 rounded-2xl shadow-large shadow-primary-500/40 mb-4"
            >
              <img
                src="/splitmuch.png"
                alt="SplitMuch Logo"
                className="w-full h-full object-contain p-1"
              />
            </motion.div>
            <h2 className="text-2xl font-display font-bold text-primary-800">
              Create Account
            </h2>
            <p className="mt-2 text-primary-600/70 text-sm">
              Join us to start splitting expenses
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-primary-700 mb-1.5"
              >
                Username *
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-primary-50/50 border-2 ${
                  errors.username ? "border-red-400" : "border-primary-100"
                } placeholder-primary-400 text-primary-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-400 transition-all font-medium`}
                placeholder="Choose a username"
              />
              {errors.username && (
                <p className="mt-1 text-xs text-red-500 font-medium">
                  {errors.username}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-primary-700 mb-1.5"
              >
                Email Address *
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-primary-50/50 border-2 ${
                  errors.email ? "border-red-400" : "border-primary-100"
                } placeholder-primary-400 text-primary-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-400 transition-all font-medium`}
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500 font-medium">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-semibold text-primary-700 mb-1.5"
              >
                Phone Number *
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                maxLength="10"
                className={`w-full px-4 py-3 bg-primary-50/50 border-2 ${
                  errors.phone ? "border-red-400" : "border-primary-100"
                } placeholder-primary-400 text-primary-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-400 transition-all font-medium`}
                placeholder="10-digit phone number"
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-500 font-medium">
                  {errors.phone}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-primary-700 mb-1.5"
              >
                Password *
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-primary-50/50 border-2 ${
                  errors.password ? "border-red-400" : "border-primary-100"
                } placeholder-primary-400 text-primary-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-400 transition-all font-medium`}
                placeholder="Create a strong password"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-500 font-medium">
                  {errors.password}
                </p>
              )}
              <p className="mt-1 text-[10px] text-primary-500/60 uppercase font-bold tracking-wider">
                Min 6 chars + Uppercase + Lowercase + Number
              </p>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-primary-700 mb-1.5"
              >
                Confirm Password *
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-primary-50/50 border-2 ${
                  errors.confirmPassword
                    ? "border-red-400"
                    : "border-primary-100"
                } placeholder-primary-400 text-primary-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-400 transition-all font-medium`}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500 font-medium">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-400 text-white font-bold rounded-xl shadow-large shadow-primary-500/40 hover:shadow-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-6"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <motion.div
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  Processing...
                </div>
              ) : (
                "Create Account"
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-primary-600/70 text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-primary-500 hover:text-primary-600 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <motion.div
          className="text-center mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Link
            to="/"
            className="text-primary-500 hover:text-primary-600 font-medium text-sm transition-colors"
          >
            ← Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
