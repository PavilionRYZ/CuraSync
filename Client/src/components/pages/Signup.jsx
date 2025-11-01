import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
    Eye,
    EyeOff,
    User,
    Mail,
    Lock,
    Phone,
    ArrowRight,
    AlertCircle,
    CheckCircle,
    Check,
    ArrowLeft,
} from 'lucide-react';
import {
    signup,
    clearError,
    clearMessage,
    setRegistrationEmail,
    clearRegistrationData,
} from '../../redux/slices/authSlice';
import AuthLayout from '../layout/AuthLayout';

const Signup = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoading, error, message, registrationEmail } = useSelector(
        (state) => state.auth
    );

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'patient',
        agreeTerms: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [registrationAttempted, setRegistrationAttempted] = useState(false);

    // Auto-redirect after successful signup
    useEffect(() => {
        if (registrationEmail) {
            navigate('/verify-otp', { state: { email: registrationEmail } });
        }
    }, [registrationEmail, navigate]);

    // Auto-clear messages
    useEffect(() => {
        if (message && !error) {
            const timer = setTimeout(() => dispatch(clearMessage()), 3000);
            return () => clearTimeout(timer);
        }
    }, [message, dispatch, error]);

    const calculatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 6) strength += 25;
        if (password.length >= 8) strength += 25;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
        if (/[0-9]/.test(password) && /[!@#$%^&*]/.test(password)) strength += 25;
        return strength;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        setFormData((prev) => ({
            ...prev,
            [name]: newValue,
        }));

        if (name === 'password') {
            setPasswordStrength(calculatePasswordStrength(value));
        }

        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const validateStep1 = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Full name is required';
        } else if (formData.name.length < 3) {
            newErrors.name = 'Name must be at least 3 characters';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.phone) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\D/g, ''))) {
            newErrors.phone = 'Please enter a valid 10-digit phone number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors = {};

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.agreeTerms) {
            newErrors.agreeTerms = 'You must agree to terms and conditions';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNextStep = () => {
        if (validateStep1()) {
            setStep(2);
            dispatch(clearError());
        }
    };

    const handleBackToStep1 = () => {
        setStep(1);
        dispatch(clearError());
        setRegistrationAttempted(false);
    };

    // ✅ NEW: Handle going back to signup from verify-otp
    const handleRetrySignup = () => {
        dispatch(clearRegistrationData());
        setStep(1);
        setRegistrationAttempted(false);
        dispatch(clearError());
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateStep2()) return;

        dispatch(clearError());
        setRegistrationAttempted(true);

        const signupData = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            role: formData.role,
        };

        const result = await dispatch(signup(signupData));

        // ✅ Handle signup error - don't move to verify-otp
        if (result.payload?.message && !result.payload?.data) {
            // Error occurred
            return;
        }

        // Success - move to verify-otp
        if (result.payload?.data) {
            dispatch(setRegistrationEmail(formData.email));
        }
    };

    return (
        <AuthLayout
            title={step === 1 ? 'Create Account' : 'Set Password'}
            subtitle={
                step === 1
                    ? 'Join thousands of satisfied patients'
                    : 'Secure your account with a strong password'
            }
        >
            <form onSubmit={step === 2 ? handleSubmit : (e) => e.preventDefault()} className="space-y-6">
                {/* Progress Indicator */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-8"
                >
                    {[1, 2].map((stepNum) => (
                        <div key={stepNum} className="flex items-center flex-1">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${step >= stepNum
                                        ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white'
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                    }`}
                            >
                                {step > stepNum ? <Check className="w-6 h-6" /> : stepNum}
                            </div>
                            {stepNum < 2 && (
                                <div
                                    className={`flex-1 h-1 mx-2 transition-all ${step > stepNum
                                            ? 'bg-gradient-to-r from-primary-600 to-accent-600'
                                            : 'bg-gray-200 dark:bg-gray-700'
                                        }`}
                                />
                            )}
                        </div>
                    ))}
                </motion.div>

                {/* ✅ NEW: Error Banner with Retry Option */}
                {error && registrationAttempted && (
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
                                        Registration Failed
                                    </p>
                                    <p className="text-sm text-red-700 dark:text-red-400">
                                        {error}
                                    </p>
                                </div>
                            </div>
                            {/* ✅ NEW: Retry Button */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="button"
                                onClick={handleRetrySignup}
                                className="text-xs font-semibold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 whitespace-nowrap px-2 py-1"
                            >
                                Retry
                            </motion.button>
                        </div>
                    </motion.div>
                )}

                {/* Success Message */}
                {message && !error && (
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

                {/* Step 1: Personal Information */}
                {step === 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-4"
                    >
                        {/* Name Field */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    className={`w-full pl-12 pr-4 py-3 rounded-lg border-2 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none ${errors.name
                                            ? 'border-red-400 focus:border-red-500'
                                            : 'border-gray-200 dark:border-gray-600 focus:border-primary-500'
                                        }`}
                                />
                            </div>
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                            )}
                        </motion.div>

                        {/* Email Field */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
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
                                            : 'border-gray-200 dark:border-gray-600 focus:border-primary-500'
                                        }`}
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                            )}
                        </motion.div>

                        {/* Phone Field */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Phone Number
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="1234567890"
                                    maxLength="10"
                                    className={`w-full pl-12 pr-4 py-3 rounded-lg border-2 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none ${errors.phone
                                            ? 'border-red-400 focus:border-red-500'
                                            : 'border-gray-200 dark:border-gray-600 focus:border-primary-500'
                                        }`}
                                />
                            </div>
                            {errors.phone && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone}</p>
                            )}
                        </motion.div>

                        {/* Next Button */}
                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={handleNextStep}
                            className="w-full py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform transition-all flex items-center justify-center space-x-2"
                        >
                            <span>Next</span>
                            <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    </motion.div>
                )}

                {/* Step 2: Password Setup */}
                {step === 2 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-4"
                    >
                        {/* Password Field */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
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
                                            : 'border-gray-200 dark:border-gray-600 focus:border-primary-500'
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

                            {/* Password Strength */}
                            {formData.password && (
                                <div className="mt-2 space-y-1">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-600 dark:text-gray-400">
                                            Password strength:
                                        </span>
                                        <span
                                            className={
                                                passwordStrength < 50
                                                    ? 'text-red-500'
                                                    : passwordStrength < 75
                                                        ? 'text-yellow-500'
                                                        : 'text-green-500'
                                            }
                                        >
                                            {passwordStrength < 50
                                                ? 'Weak'
                                                : passwordStrength < 75
                                                    ? 'Fair'
                                                    : 'Strong'}
                                        </span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${passwordStrength}%` }}
                                            className={`h-full transition-all ${passwordStrength < 50
                                                    ? 'bg-red-500'
                                                    : passwordStrength < 75
                                                        ? 'bg-yellow-500'
                                                        : 'bg-green-500'
                                                }`}
                                        />
                                    </div>
                                </div>
                            )}

                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                            )}
                        </motion.div>

                        {/* Confirm Password Field */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className={`w-full pl-12 pr-12 py-3 rounded-lg border-2 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none ${errors.confirmPassword
                                            ? 'border-red-400 focus:border-red-500'
                                            : 'border-gray-200 dark:border-gray-600 focus:border-primary-500'
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                    {errors.confirmPassword}
                                </p>
                            )}
                        </motion.div>

                        {/* Terms & Conditions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <label className="flex items-start space-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="agreeTerms"
                                    checked={formData.agreeTerms}
                                    onChange={handleChange}
                                    className="w-5 h-5 rounded border-gray-300 accent-primary-600 cursor-pointer mt-0.5"
                                />
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    I agree to the{' '}
                                    <Link
                                        to="#"
                                        className="text-primary-600 dark:text-primary-400 hover:underline font-semibold"
                                    >
                                        Terms and Conditions
                                    </Link>{' '}
                                    and{' '}
                                    <Link
                                        to="#"
                                        className="text-primary-600 dark:text-primary-400 hover:underline font-semibold"
                                    >
                                        Privacy Policy
                                    </Link>
                                </span>
                            </label>
                            {errors.agreeTerms && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                    {errors.agreeTerms}
                                </p>
                            )}
                        </motion.div>

                        {/* Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex gap-4"
                        >
                            <button
                                type="button"
                                onClick={handleBackToStep1}
                                className="flex-1 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                <span>Back</span>
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Creating Account...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Create Account</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </motion.div>
                    </motion.div>
                )}

                {/* Login Link */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: step === 1 ? 0.5 : 0.5 }}
                    className="text-center text-sm text-gray-600 dark:text-gray-400"
                >
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className="text-primary-600 dark:text-primary-400 font-semibold hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                    >
                        Sign in here
                    </Link>
                </motion.div>
            </form>
        </AuthLayout>
    );
};

export default Signup;
