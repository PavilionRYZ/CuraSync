import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { login, clearError, clearMessage } from '../../redux/slices/authSlice';
import AuthLayout from '../layout/AuthLayout';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated, isLoading, error, message } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    // Auto-clear messages
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => dispatch(clearMessage()), 3000);
            return () => clearTimeout(timer);
        }
    }, [message, dispatch]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        dispatch(clearError());
        const result = await dispatch(login(formData));

        if (result.payload?.user) {
            setFormData({ email: '', password: '' });
        }
    };

    return (
        <AuthLayout
            title="Welcome Back"
            subtitle="Sign in to your account to continue"
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
                        <div>
                            <p className="text-sm font-medium text-red-800 dark:text-red-300">
                                {error}
                            </p>
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
                        <div>
                            <p className="text-sm font-medium text-green-800 dark:text-green-300">
                                {message}
                            </p>
                        </div>
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
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your@email.com"
                            className={`w-full pl-12 pr-4 py-3 rounded-lg border-2 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none ${errors.email
                                ? 'border-red-400 focus:border-red-500'
                                : 'border-gray-200 dark:border-gray-600 focus:border-primary-500 dark:focus:border-primary-400'
                                }`}
                        />
                    </div>
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                    )}
                </motion.div>

                {/* Password Field */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Password
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className={`w-full pl-12 pr-12 py-3 rounded-lg border-2 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none ${errors.password
                                ? 'border-red-400 focus:border-red-500'
                                : 'border-gray-200 dark:border-gray-600 focus:border-primary-500 dark:focus:border-primary-400'
                                }`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                            {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                    )}
                </motion.div>

                {/* Remember & Forgot */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center justify-between text-sm"
                >
                    <label className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 cursor-pointer">
                        <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-gray-300 accent-primary-600 cursor-pointer"
                        />
                        <span>Remember me</span>
                    </label>
                    <Link
                        to="/forgot-password"
                        className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors"
                    >
                        Forgot password?
                    </Link>
                </motion.div>

                {/* Submit Button */}
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                    {isLoading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Logging in...</span>
                        </>
                    ) : (
                        <>
                            <span>Sign In</span>
                            <ArrowRight className="w-5 h-5" />
                        </>
                    )}
                </motion.button>

                {/* Sign Up Link */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-center"
                >
                    <p className="text-gray-600 dark:text-gray-400">
                        Don't have an account?{' '}
                        <Link
                            to="/signup"
                            className="text-primary-600 dark:text-primary-400 font-semibold hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                        >
                            Sign up now
                        </Link>
                    </p>
                </motion.div>

                {/* Divider */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="relative"
                >
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                            Or continue with
                        </span>
                    </div>
                </motion.div>

                {/* Social Login */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="grid grid-cols-2 gap-4"
                >
                    <button
                        type="button"
                        className="flex items-center justify-center py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                    >
                        <span className="text-2xl">🔵</span>
                    </button>
                    <button
                        type="button"
                        className="flex items-center justify-center py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                    >
                        <span className="text-2xl">🔍</span>
                    </button>
                </motion.div>
            </form>
        </AuthLayout>
    );
};

export default Login;
