import { motion } from 'framer-motion';
import { X, MapPin, Phone, Mail, Clock, Award } from 'lucide-react';

const ClinicViewModal = ({ clinic, isOpen, onClose }) => {
    if (!isOpen) return null;

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    const getWorkingHoursDisplay = (day) => {
        const hours = clinic.workingHours?.[day];
        if (hours?.start === 'Closed') return 'Closed';
        return `${hours?.start} - ${hours?.end}`;
    };

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
                className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            >
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between z-10">
                    <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
                        Clinic Details
                    </h2>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </motion.button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Clinic Name */}
                    <div>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            {clinic.name}
                        </h3>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-3">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                            Contact Information
                        </h4>
                        <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                            <span className="text-gray-700 dark:text-gray-300">{clinic.phone}</span>
                        </div>
                        {clinic.email && (
                            <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                                <span className="text-gray-700 dark:text-gray-300">{clinic.email}</span>
                            </div>
                        )}
                    </div>

                    {/* Address */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            Address
                        </h4>
                        <div className="space-y-1 text-gray-700 dark:text-gray-300 text-sm">
                            <p>{clinic.address?.street}</p>
                            <p>
                                {clinic.address?.city}, {clinic.address?.state} {clinic.address?.zipCode}
                            </p>
                            <p>{clinic.address?.country}</p>
                        </div>
                    </div>

                    {/* Facilities */}
                    {clinic.facilities && clinic.facilities.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                <Award className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                                Facilities
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {clinic.facilities.map((facility, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-semibold"
                                    >
                                        {facility}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Working Hours */}
                    <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                            Working Hours
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            {days.map((day) => (
                                <div
                                    key={day}
                                    className="p-2 bg-gray-50 dark:bg-gray-900 rounded capitalize"
                                >
                                    <p className="font-semibold text-gray-900 dark:text-white">{day}</p>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {getWorkingHoursDisplay(day)}
                                    </p>
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

export default ClinicViewModal;
