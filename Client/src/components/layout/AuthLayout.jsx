import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
            {/* Animated Background Elements */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'linear',
                }}
                className="absolute top-0 left-0 w-96 h-96 bg-primary-200 dark:bg-primary-900 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-20 -z-10"
            />
            <motion.div
                animate={{
                    scale: [1.2, 1, 1.2],
                    rotate: [90, 0, 90],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: 'linear',
                }}
                className="absolute bottom-0 right-0 w-96 h-96 bg-accent-200 dark:bg-accent-900 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-20 -z-10"
            />

            <div className="w-full px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        {/* Left Side - Branding */}
                        <motion.div
                            initial={{ opacity: 0, x: -60 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="hidden lg:flex flex-col justify-center"
                        >
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="mb-8"
                            >
                                <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-accent-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                                    <Heart className="w-8 h-8 text-white" fill="currentColor" />
                                </div>
                                <h1 className="text-5xl font-heading font-bold text-gray-900 dark:text-white mb-4">
                                    Welcome to{' '}
                                    <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                                        CuraSync
                                    </span>
                                </h1>
                            </motion.div>

                            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                                Your trusted healthcare companion. Connect with expert doctors, get AI-powered recommendations, and manage your health seamlessly.
                            </p>

                            <div className="space-y-4">
                                {[
                                    { icon: '🏥', text: '200+ Expert Doctors' },
                                    { icon: '⚡', text: 'AI-Powered Recommendations' },
                                    { icon: '🔒', text: '100% Secure & Private' },
                                    { icon: '📱', text: '24/7 Available' },
                                ].map((feature, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-center space-x-3"
                                    >
                                        <span className="text-3xl">{feature.icon}</span>
                                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                                            {feature.text}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Right Side - Auth Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 60 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="w-full"
                        >
                            {/* Mobile Logo */}
                            <div className="lg:hidden text-center mb-8">
                                <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                                    <Heart className="w-7 h-7 text-white" fill="currentColor" />
                                </div>
                                <h1 className="text-3xl font-heading font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                                    CuraSync
                                </h1>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-10 border border-gray-100 dark:border-gray-700">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                                        {title}
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                                        {subtitle}
                                    </p>
                                </motion.div>

                                {children}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
