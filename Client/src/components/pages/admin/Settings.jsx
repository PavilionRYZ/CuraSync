import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Bell, Lock, Eye } from 'lucide-react';

const AdminSettings = () => {
    const settings = [
        {
            title: 'Notification Settings',
            icon: Bell,
            description: 'Manage email and push notifications',
            comingSoon: false,
        },
        {
            title: 'Security',
            icon: Lock,
            description: 'Change password and security settings',
            comingSoon: true,
        },
        {
            title: 'Privacy',
            icon: Eye,
            description: 'Manage privacy preferences',
            comingSoon: true,
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div>
                <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
                    Settings
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Manage your account and system settings
                </p>
            </div>

            <div className="grid gap-4">
                {settings.map((setting, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`bg-white dark:bg-gray-800 rounded-xl p-6 ${setting.comingSoon ? 'opacity-50' : ''
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                                    <setting.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                        {setting.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {setting.description}
                                    </p>
                                </div>
                            </div>
                            {setting.comingSoon && (
                                <span className="text-xs font-bold px-3 py-1 bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 rounded-full">
                                    Coming Soon
                                </span>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default AdminSettings;
