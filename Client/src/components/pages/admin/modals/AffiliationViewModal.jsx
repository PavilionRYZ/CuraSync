import React from 'react';
import { motion } from 'framer-motion';
import {
    X,
    Clock,
    MapPin,
    Award,
    DollarSign,
    CheckCircle,
} from 'lucide-react';

const AffiliationViewModal = ({ affiliation, isOpen, onClose }) => {
    if (!isOpen) return null;

    const days = [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday',
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full shadow-2xl"
            >
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-accent-600 text-white p-6 flex items-center justify-between z-10 rounded-t-2xl">
                    <h2 className="text-2xl font-heading font-bold">
                        Affiliation Details
                    </h2>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </motion.button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Doctor & Clinic Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                                Doctor
                            </h4>
                            <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
                                {affiliation.doctorId?.userId?.name}
                            </p>
                            <p className="text-sm text-blue-600 dark:text-blue-400 capitalize">
                                {affiliation.doctorId?.specialization?.join(', ')}
                            </p>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                                Clinic
                            </h4>
                            <p className="text-lg font-bold text-green-700 dark:text-green-300">
                                {affiliation.clinicId?.name}
                            </p>
                            <p className="text-sm text-green-600 dark:text-green-400">
                                {affiliation.clinicId?.address?.city}
                            </p>
                        </div>
                    </div>

                    {/* Key Details */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <DollarSign className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                                <span className="font-semibold text-gray-700 dark:text-gray-300">
                                    Consultation Fee
                                </span>
                            </div>
                            <p className="text-2xl font-bold text-primary-700 dark:text-primary-300">
                                ₹{affiliation.consultationFee}
                            </p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Clock className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                                <span className="font-semibold text-gray-700 dark:text-gray-300">
                                    Working Hours
                                </span>
                            </div>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                                {affiliation.workingHours?.start} - {affiliation.workingHours?.end}
                            </p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                                <span className="font-semibold text-gray-700 dark:text-gray-300">
                                    Status
                                </span>
                            </div>
                            <p className={`text-lg font-bold capitalize ${affiliation.status === 'active'
                                    ? 'text-green-700 dark:text-green-300'
                                    : 'text-gray-700 dark:text-gray-300'
                                }`}>
                                {affiliation.status}
                            </p>
                        </div>
                    </div>

                    {/* Room & Department */}
                    {(affiliation.roomNumber || affiliation.department) && (
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-2">
                            {affiliation.department && (
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-700 dark:text-gray-300">
                                        Department:
                                    </span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {affiliation.department}
                                    </span>
                                </div>
                            )}
                            {affiliation.roomNumber && (
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-700 dark:text-gray-300">
                                        Room Number:
                                    </span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {affiliation.roomNumber}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Working Days */}
                    <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                            Working Days
                        </h4>
                        <div className="grid grid-cols-7 gap-2">
                            {days.map((day) => (
                                <div
                                    key={day}
                                    className={`p-3 rounded-lg text-center capitalize font-semibold text-sm ${affiliation.workingDays?.includes(day)
                                            ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-500'
                                        }`}
                                >
                                    {day.slice(0, 3)}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 dark:border-gray-700 p-6">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onClose}
                        className="w-full py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                        Close
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default AffiliationViewModal;
