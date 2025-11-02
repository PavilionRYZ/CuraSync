import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Stethoscope,
    Calendar,
    TrendingUp,
    Activity,
    Award,
} from 'lucide-react';

const DashboardOverview = () => {
    const stats = [
        {
            title: 'Total Doctors',
            value: '45',
            change: '+12%',
            icon: Stethoscope,
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        },
        {
            title: 'Active Users',
            value: '1,234',
            change: '+8%',
            icon: Users,
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-50 dark:bg-green-900/20',
        },
        {
            title: 'Appointments Today',
            value: '28',
            change: '+5%',
            icon: Calendar,
            color: 'from-purple-500 to-purple-600',
            bgColor: 'bg-purple-50 dark:bg-purple-900/20',
        },
        {
            title: 'Revenue',
            value: '₹45,000',
            change: '+18%',
            icon: TrendingUp,
            color: 'from-orange-500 to-orange-600',
            bgColor: 'bg-orange-50 dark:bg-orange-900/20',
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
        },
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
        >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        variants={itemVariants}
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-600 dark:text-gray-300 font-semibold">
                                {stat.title}
                            </h3>
                            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                                <stat.icon className={`w-6 h-6 text-${stat.color.split('-')}-600`} />
                            </div>
                        </div>

                        <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            {stat.value}
                        </p>

                        <div className="flex items-center space-x-2">
                            <span className="text-green-600 dark:text-green-400 font-semibold">
                                {stat.change}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                from last month
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
                >
                    <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-6">
                        Recent Activity
                    </h2>
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((item) => (
                            <div
                                key={item}
                                className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                            >
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center text-white">
                                    <Activity className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        Doctor registered
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        2 hours ago
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Quick Stats */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
                >
                    <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-6">
                        System Health
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-700 dark:text-gray-300 font-semibold">
                                    Server Status
                                </span>
                                <span className="text-green-600 dark:text-green-400 font-bold">
                                    100%
                                </span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div className="h-full w-full bg-green-600 rounded-full"></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-700 dark:text-gray-300 font-semibold">
                                    Database
                                </span>
                                <span className="text-blue-600 dark:text-blue-400 font-bold">
                                    95%
                                </span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div className="h-full w-4/5 bg-blue-600 rounded-full"></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-700 dark:text-gray-300 font-semibold">
                                    API Response
                                </span>
                                <span className="text-yellow-600 dark:text-yellow-400 font-bold">
                                    87%
                                </span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div className="h-full w-10/12 bg-yellow-600 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default DashboardOverview;
