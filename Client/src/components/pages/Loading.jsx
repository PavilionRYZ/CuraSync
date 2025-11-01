import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const Loading = ({ fullPage = true, message = 'Loading...' }) => {
    const loadingVariants = {
        container: {
            hidden: { opacity: 0 },
            visible: {
                opacity: 1,
                transition: {
                    staggerChildren: 0.1,
                },
            },
        },
        item: {
            hidden: { opacity: 0, y: -20 },
            visible: {
                opacity: 1,
                y: 0,
                transition: {
                    duration: 0.6,
                },
            },
        },
    };

    const pulseVariants = {
        initial: { scale: 1, opacity: 0.5 },
        animate: {
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
            },
        },
    };

    const spinVariants = {
        animate: {
            rotate: 360,
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
            },
        },
    };

    const content = (
        <motion.div
            variants={loadingVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center justify-center space-y-8"
        >
            {/* Logo Animation */}
            <motion.div
                variants={loadingVariants}
                className="relative w-24 h-24"
            >
                {/* Outer rotating circle */}
                <motion.div
                    variants={spinVariants}
                    animate="animate"
                    className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-600 border-r-accent-600"
                />

                {/* Pulsing inner circle */}
                <motion.div
                    variants={pulseVariants}
                    initial="initial"
                    animate="animate"
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center"
                >
                    <Heart className="w-10 h-10 text-white" fill="currentColor" />
                </motion.div>
            </motion.div>

            {/* Text Animation */}
            <motion.div variants={loadingVariants} className="text-center space-y-3">
                <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
                    {message}
                </h2>

                {/* Animated dots */}
                <div className="flex justify-center items-center space-x-2 h-6">
                    {[0, 1, 2].map((index) => (
                        <motion.div
                            key={index}
                            animate={{ y: [0, -10, 0] }}
                            transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                delay: index * 0.2,
                            }}
                            className="w-2 h-2 rounded-full bg-primary-600"
                        />
                    ))}
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Please wait while we prepare things for you...
                </p>
            </motion.div>

            {/* Progress Bar */}
            <motion.div
                variants={loadingVariants}
                className="w-48 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
            >
                <motion.div
                    animate={{
                        x: [-100, 100],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    className="h-full w-1/3 bg-gradient-to-r from-transparent via-primary-600 to-transparent"
                />
            </motion.div>
        </motion.div>
    );

    if (!fullPage) {
        return content;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
            {/* Animated Background Elements */}
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
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
                    scale: [1.1, 1, 1.1],
                    rotate: [90, 0, 90],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: 'linear',
                }}
                className="absolute bottom-0 right-0 w-96 h-96 bg-accent-200 dark:bg-accent-900 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-20 -z-10"
            />

            {content}
        </div>
    );
};

export default Loading;
