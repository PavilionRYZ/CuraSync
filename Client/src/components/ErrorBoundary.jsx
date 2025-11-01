import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            errorCount: 0,
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log error details
        console.error('Error caught by boundary:', error);
        console.error('Error info:', errorInfo);

        // Update state
        this.setState((prevState) => ({
            error,
            errorInfo,
            errorCount: prevState.errorCount + 1,
        }));

        // Send to error logging service (optional)
        this.logErrorToService(error, errorInfo);
    }

    logErrorToService = (error, errorInfo) => {
        // Send to your error tracking service (Sentry, LogRocket, etc.)
        const errorData = {
            message: error.toString(),
            stack: error.stack,
            componentStack: errorInfo.componentStack,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
        };

        console.error('Error logged:', errorData);
        // Uncomment to send to service
        // fetch('/api/v1/logs/errors', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(errorData),
        // });
    };

    handleReset = () => {
        // If too many errors, navigate home
        if (this.state.errorCount > 3) {
            window.location.href = '/';
            return;
        }

        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    render() {
        if (this.state.hasError) {
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

                    <div className="max-w-2xl mx-auto px-4 py-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center space-y-8"
                        >
                            {/* Error Icon */}
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="relative w-32 h-32 mx-auto"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-500 rounded-full flex items-center justify-center shadow-2xl">
                                    <AlertCircle className="w-16 h-16 text-white" />
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
                                    className="absolute inset-0 bg-red-400 rounded-full opacity-30"
                                />
                            </motion.div>

                            {/* Error Title */}
                            <div>
                                <h1 className="text-5xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                                    Oops! Something Went Wrong
                                </h1>
                                <p className="text-lg text-gray-600 dark:text-gray-400">
                                    We encountered an unexpected error. Our team has been notified.
                                </p>
                            </div>

                            {/* Error Details (Development Only) */}
                            {import.meta.env.NODE_ENV === 'development' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-left max-h-64 overflow-y-auto"
                                >
                                    <p className="text-sm font-semibold text-red-800 dark:text-red-300 mb-2">
                                        Error Details (Development Only):
                                    </p>
                                    <p className="text-xs text-red-700 dark:text-red-400 font-mono mb-3">
                                        {this.state.error?.toString()}
                                    </p>
                                    {this.state.errorInfo && (
                                        <details className="text-xs text-red-600 dark:text-red-500 font-mono">
                                            <summary className="cursor-pointer font-semibold">
                                                Component Stack
                                            </summary>
                                            <pre className="mt-2 whitespace-pre-wrap">
                                                {this.state.errorInfo.componentStack}
                                            </pre>
                                        </details>
                                    )}
                                </motion.div>
                            )}

                            {/* Error Count Warning */}
                            {this.state.errorCount > 2 && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
                                >
                                    <p className="text-sm text-yellow-800 dark:text-yellow-300">
                                        ⚠️ Multiple errors detected. If the problem persists, please refresh the page or go home.
                                    </p>
                                </motion.div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={this.handleReset}
                                    className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg shadow-lg transition-colors"
                                >
                                    <RefreshCw className="w-5 h-5" />
                                    <span>Try Again</span>
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => (window.location.href = '/')}
                                    className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
                                >
                                    <Home className="w-5 h-5" />
                                    <span>Go Home</span>
                                </motion.button>
                            </div>

                            {/* Support Contact */}
                            <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                    If the problem persists, please contact support
                                </p>
                                <a
                                    href="mailto:support@curasync.com"
                                    className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold transition-colors"
                                >
                                    support@curasync.com
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
