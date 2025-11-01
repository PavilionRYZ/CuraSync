import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  RotateCcw,
  ArrowLeft,
  Edit2,
} from 'lucide-react';
import {
  verifyOtp,
  resendOtp,
  clearError,
  clearMessage,
  clearRegistrationData,
} from '../../redux/slices/authSlice';
import AuthLayout from '../layout/AuthLayout';

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error, message, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const email = location.state?.email || '';
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(0);
  const [errors, setErrors] = useState('');
  const [otpAttempted, setOtpAttempted] = useState(false);

  // Auto-redirect after successful verification
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // If no email provided, redirect back to signup
  useEffect(() => {
    if (!email) {
      navigate('/signup');
    }
  }, [email, navigate]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Auto-clear messages
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => dispatch(clearMessage()), 3000);
      return () => clearTimeout(timer);
    }
  }, [message, dispatch]);

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }

    if (errors) setErrors('');
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const otpCode = otp.join('');

    if (!otpCode || otpCode.length !== 6) {
      setErrors('Please enter a valid 6-digit OTP');
      return;
    }

    setOtpAttempted(true);
    dispatch(clearError());
    const result = await dispatch(verifyOtp({ email, otp: otpCode }));

    if (result.payload?.user) {
      setOtp(['', '', '', '', '', '']);
    }
  };

  const handleResendOtp = async () => {
    dispatch(clearError());
    await dispatch(resendOtp(email));
    setResendTimer(60);
  };

  // ✅ NEW: Handle going back to signup
  const handleBackToSignup = () => {
    dispatch(clearRegistrationData());
    navigate('/signup');
  };

  return (
    <AuthLayout
      title="Verify Your Email"
      subtitle="Enter the OTP sent to your email"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Display with Edit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg flex items-center justify-between"
        >
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Verification code sent to
            </p>
            <p className="font-semibold text-gray-900 dark:text-white break-all">
              {email}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={handleBackToSignup}
            title="Change email"
            className="p-2 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </motion.button>
        </motion.div>

        {/* Error Message with Retry */}
        {error && otpAttempted && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start space-x-3 flex-1">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-800 dark:text-red-300 mb-1">
                    OTP Verification Failed
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-400">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Success Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start space-x-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
          >
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-green-800 dark:text-green-300">
              {message}
            </p>
          </motion.div>
        )}

        {/* Custom Validation Error */}
        {errors && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start space-x-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
          >
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-red-800 dark:text-red-300">{errors}</p>
          </motion.div>
        )}

        {/* OTP Input Fields */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Enter Verification Code
          </label>
          <div className="flex gap-3 justify-between">
            {otp.map((digit, index) => (
              <motion.input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                value={digit}
                onChange={(e) => handleOtpChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                maxLength="1"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none transition-colors"
              />
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-3"
        >
          {/* Back to Signup Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={handleBackToSignup}
            className="flex-1 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </motion.button>

          {/* Verify Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading || otp.join('').length !== 6}
            className="flex-1 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <span>Verify Email</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Resend OTP */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Didn't receive the code?
          </p>
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={resendTimer > 0 || isLoading}
            className="inline-flex items-center space-x-2 text-primary-600 dark:text-primary-400 font-semibold hover:text-primary-700 dark:hover:text-primary-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>
              {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
            </span>
          </button>
        </motion.div>
      </form>
    </AuthLayout>
  );
};

export default VerifyOtp;
