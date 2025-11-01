import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowLeft, Home, RefreshCw } from 'lucide-react';

const ErrorPage = ({ statusCode = 500, message = null, resetError = null }) => {
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 },
        },
    };

    const getErrorDetails = (code) => {
        const errors = {
            404: {
                title: 'Page Not Found',
                description: 'The page you are looking for does not exist.',
                icon: '🔍',
                color: 'from-yellow-600 to-yellow-500',
            },
            500: {
                title: 'Internal Server Error',
                description: 'Something went wrong on our end. Please try again later.',
                icon: '⚠️',
                color: 'from-red-600 to-red-500',
            },
            503: {
                title: 'Service Unavailable',
                description: 'Our service is temporarily down for maintenance.',
                icon: '🔧',
                color: 'from-orange-600 to-orange-500',
            },
        };

        return errors[code] || errors;
    };

    const details = getErrorDetails(statusCode);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
            {/* Background Elements */}
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
                className="absolute top-0 left-0 w-96 h-96 bg-red-200 dark:bg-red-900 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-20 -z-10"
            />
            <motion.div
                animate={{
                    scale: [1.1, 1, 1.1],
                    rotate: [90, 0, 90],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: 'linear',
                }}
                className="absolute bottom-0 right-0 w-96 h-96 bg-orange-200 dark:bg-orange-900 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-20 -z-10"
            />

            <div className="max-w-2xl mx-auto px-4 py-8">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-center space-y-8"
                >
                    {/* Error Icon */}
                    <motion.div
                        variants={itemVariants}
                        className="relative w-32 h-32 mx-auto"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${details.color} rounded-full flex items-center justify-center shadow-2xl`}>
                            <AlertTriangle className="w-16 h-16 text-white" />
                        </div>
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                            className={`absolute inset-0 bg-gradient-to-br ${details.color} rounded-full opacity-30`}
                        />
                    </motion.div>

                    {/* Error Code */}
                    <motion.div variants={itemVariants}>
                        <h1 className={`text-8xl font-heading font-bold bg-gradient-to-r ${details.color} bg-clip-text text-transparent mb-2`}>
                            {statusCode}
                        </h1>
                        <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
                            {details.title}
                        </h2>
                    </motion.div>

                    {/* Description */}
                    <motion.div variants={itemVariants} className="space-y-3">
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            {message || details.description}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">
                            Our team has been notified about this issue and is working to fix it.
                        </p>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
                    >
                        {resetError && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={resetError}
                                className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg shadow-lg transition-colors"
                            >
                                <RefreshCw className="w-5 h-5" />
                                <span>Try Again</span>
                            </motion.button>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate(-1)}
                            className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg shadow-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Go Back</span>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/')}
                            className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 hover:shadow-xl text-white font-semibold rounded-lg shadow-lg transition-all"
                        >
                            <Home className="w-5 h-5" />
                            <span>Go Home</span>
                        </motion.button>
                    </motion.div>

                    {/* Error Code for Support */}
                    <motion.div
                        variants={itemVariants}
                        className="pt-8 border-t border-gray-200 dark:border-gray-700"
                    >
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                            Error Reference: {statusCode}-{Date.now().toString().slice(-6)}
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default ErrorPage;
