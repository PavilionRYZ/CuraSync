import { motion } from 'framer-motion';
import { X, Mail, Phone, Award, Calendar, MapPin, CheckCircle } from 'lucide-react';

const DoctorViewModal = ({ doctor, isOpen, onClose }) => {
    if (!isOpen) return null;

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
                        Doctor Details
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
                    {/* Profile Section */}
                    <div className="flex items-start gap-6">
                        <img
                            src={doctor.profileImage?.url || '/placeholder.jpg'}
                            alt={doctor.userId?.name}
                            className="w-32 h-32 rounded-lg object-cover border-4 border-primary-200 dark:border-primary-800"
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/150?text=Doctor';
                            }}
                        />
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                {doctor.userId?.name}
                            </h3>
                            {doctor.isVerified && (
                                <span className="inline-flex items-center space-x-1 px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full mb-3">
                                    <CheckCircle className="w-4 h-4" />
                                    <span className="text-sm font-semibold">Verified Doctor</span>
                                </span>
                            )}
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                {doctor.bio || 'No bio available'}
                            </p>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-3">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                            Contact Information
                        </h4>
                        <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                            <span className="text-gray-700 dark:text-gray-300">
                                {doctor.userId?.email}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                            <span className="text-gray-700 dark:text-gray-300">
                                {doctor.userId?.phone}
                            </span>
                        </div>
                    </div>

                    {/* Professional Details */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    License Number
                                </span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 font-mono">
                                {doctor.licenseNumber}
                            </p>
                        </div>

                        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    Experience
                                </span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">
                                {doctor.experience} years
                            </p>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    Consultation Fee
                                </span>
                            </div>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                ₹{doctor.consultationFee}
                            </p>
                        </div>

                        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    Rating
                                </span>
                            </div>
                            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                                {doctor.rating?.toFixed(1) || '0.0'} ⭐
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {doctor.totalReviews || 0} reviews
                            </p>
                        </div>
                    </div>

                    {/* Specializations */}
                    <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                            Specializations
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {doctor.specialization?.map((spec, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium capitalize"
                                >
                                    {spec}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Qualifications */}
                    {doctor.qualifications && doctor.qualifications.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                                Qualifications
                            </h4>
                            <div className="space-y-2">
                                {doctor.qualifications.map((qual, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                                    >
                                        <Award className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-1" />
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                {qual.degree}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {qual.institution} • {qual.year}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Languages */}
                    {doctor.languages && doctor.languages.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                                Languages
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {doctor.languages.map((lang, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                                    >
                                        {lang}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
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

export default DoctorViewModal;
