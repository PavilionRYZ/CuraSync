import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Plus } from 'lucide-react';

const AppointmentManagement = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
                        Appointment Management
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Coming Soon - Manage and track appointments
                    </p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled
                    className="flex items-center space-x-2 px-6 py-3 bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-lg font-semibold opacity-50 cursor-not-allowed"
                >
                    <Plus className="w-5 h-5" />
                    <span>New Appointment</span>
                </motion.button>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-dashed border-purple-300 dark:border-purple-700 rounded-xl p-12 text-center"
            >
                <Calendar className="w-16 h-16 mx-auto text-purple-400 mb-4 opacity-50" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Feature Coming Soon
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                    Appointment management features will be available in the next update
                </p>
            </motion.div>
        </motion.div>
    );
};

export default AppointmentManagement;
