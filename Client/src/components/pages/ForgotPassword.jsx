import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { forgotPassword, clearError, clearMessage } from '../../redux/slices/authSlice';
import AuthLayout from '../layout/AuthLayout';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoading, error, message } = useSelector((state) => state.auth);

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => dispatch(clearMessage()), 3000);
            return () => clearTimeout(timer);
        }
    }, [message, dispatch]);

    const validateEmail = () => {
        if (!email) {
            setEmailError('Email is required');
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setEmailError('Please enter a valid email');
            return false;
        }
        setEmailError('');
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateEmail()) return;

        dispatch(clearError());
        const result = await dispatch(forgotPassword(email));

        if (result.payload) {
            setSubmitted(true);
            setTimeout(() => {
                navigate('/reset-password', { state: { email } });
            }, 2000);
        }
    };

    return (
        <AuthLayout
            title="Reset Your Password"
            subtitle="We'll send you an email to reset your password"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start space-x-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                    >
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm font-medium text-red-800 dark:text-red-300">{error}</p>
                    </motion.div>
                )}

                {/* Success Message */}
                {submitted && message && (
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

                {/* Email Field */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Email Address
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (emailError) setEmailError('');
                            }}
                            placeholder="your@email.com"
                            disabled={submitted}
                            className={`w-full pl-12 pr-4 py-3 rounded-lg border-2 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none disabled:opacity-50 ${emailError
                                ? 'border-red-400 focus:border-red-500'
                                : 'border-gray-200 dark:border-gray-600 focus:border-primary-500'
                                }`}
                        />
                    </div>
                    {emailError && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{emailError}</p>
                    )}
                </motion.div>

                {/* Submit Button */}
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading || submitted}
                    className="w-full py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
                >
                    {isLoading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Sending...</span>
                        </>
                    ) : submitted ? (
                        <>
                            <CheckCircle className="w-5 h-5" />
                            <span>Email Sent!</span>
                        </>
                    ) : (
                        <span>Send Reset Link</span>
                    )}
                </motion.button>

                {/* Back to Login */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center"
                >
                    <Link
                        to="/login"
                        className="inline-flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Login</span>
                    </Link>
                </motion.div>
            </form>
        </AuthLayout>
    );
};

export default ForgotPassword;
