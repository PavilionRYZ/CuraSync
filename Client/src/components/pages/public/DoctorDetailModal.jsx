import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    X,
    Star,
    CheckCircle,
    Award,
    Clock,
    Users,
    MapPin,
    Phone,
    Mail,
    BookOpen,
    MessageSquare,
} from 'lucide-react';

const DoctorDetailModal = ({ doctor, isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('about');

    if (!isOpen) return null;

    const tabs = [
        { id: 'about', label: 'About', icon: BookOpen },
        { id: 'qualifications', label: 'Qualifications', icon: Award },
        { id: 'experience', label: 'Experience', icon: Clock },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 rounded-2xl max-w-3xl w-full shadow-2xl my-8"
            >
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-accent-600 text-white p-6 flex items-start justify-between z-10 rounded-t-2xl">
                    <div className="flex-1">
                        <h2 className="text-3xl font-heading font-bold">{doctor.userId?.name}</h2>
                        <p className="text-primary-100 capitalize mt-1">
                            {doctor.specialization?.join(', ')}
                        </p>
                    </div>
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
                <div className="p-6 space-y-6 max-h-[calc(90vh-200px)] overflow-y-auto">
                    {/* Doctor Image and Key Stats */}
                    <div className="flex gap-6">
                        <img
                            src={doctor.profileImage?.url || '/placeholder.jpg'}
                            alt={doctor.userId?.name}
                            className="w-40 h-40 rounded-lg object-cover border-4 border-primary-200 dark:border-primary-800"
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/200?text=Doctor';
                            }}
                        />
                        <div className="flex-1 space-y-3">
                            {/* Verification and Rating */}
                            <div className="flex flex-wrap gap-3">
                                {doctor.isVerified && (
                                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full font-semibold">
                                        <CheckCircle className="w-5 h-5" />
                                        Verified Doctor
                                    </span>
                                )}
                                {doctor.rating && (
                                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full font-semibold">
                                        <Star className="w-5 h-5" />
                                        {doctor.rating.toFixed(1)} ({doctor.totalReviews || 0} reviews)
                                    </span>
                                )}
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                                    <p className="text-blue-600 dark:text-blue-400 text-sm font-semibold">
                                        Experience
                                    </p>
                                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                                        {doctor.experience}+
                                    </p>
                                    <p className="text-xs text-blue-600 dark:text-blue-400">years</p>
                                </div>
                                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                                    <p className="text-green-600 dark:text-green-400 text-sm font-semibold">
                                        Consultation
                                    </p>
                                    <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                                        ₹{doctor.consultationFee}
                                    </p>
                                    <p className="text-xs text-green-600 dark:text-green-400">per session</p>
                                </div>
                                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                                    <p className="text-purple-600 dark:text-purple-400 text-sm font-semibold">
                                        License
                                    </p>
                                    <p className="text-lg font-bold text-purple-700 dark:text-purple-300 truncate">
                                        {doctor.licenseNumber}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-3">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                            Contact Information
                        </h4>
                        {doctor.userId?.email && (
                            <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                                <span className="text-gray-700 dark:text-gray-300">
                                    {doctor.userId.email}
                                </span>
                            </div>
                        )}
                        {doctor.userId?.phone && (
                            <div className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                                <span className="text-gray-700 dark:text-gray-300">
                                    {doctor.userId.phone}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Tabs */}
                    <div>
                        <div className="flex gap-2 mb-4 border-b border-gray-200 dark:border-gray-700">
                            {tabs.map((tab) => (
                                <motion.button
                                    key={tab.id}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-2 font-semibold transition-all ${activeTab === tab.id
                                            ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                        }`}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    {tab.label}
                                </motion.button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* About Tab */}
                            {activeTab === 'about' && (
                                <div className="space-y-4">
                                    <div>
                                        <h5 className="font-semibold text-gray-900 dark:text-white mb-2">
                                            About
                                        </h5>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            {doctor.bio || 'Experienced healthcare professional'}
                                        </p>
                                    </div>

                                    {doctor.languages && doctor.languages.length > 0 && (
                                        <div>
                                            <h5 className="font-semibold text-gray-900 dark:text-white mb-2">
                                                Languages
                                            </h5>
                                            <div className="flex flex-wrap gap-2">
                                                {doctor.languages.map((lang, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-semibold"
                                                    >
                                                        {lang}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Qualifications Tab */}
                            {activeTab === 'qualifications' && (
                                <div className="space-y-3">
                                    {doctor.qualifications && doctor.qualifications.length > 0 ? (
                                        doctor.qualifications.map((qual, index) => (
                                            <div
                                                key={index}
                                                className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border-l-4 border-primary-500"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <Award className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-1 flex-shrink-0" />
                                                    <div className="flex-1">
                                                        <h5 className="font-semibold text-gray-900 dark:text-white">
                                                            {qual.degree}
                                                        </h5>
                                                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                                                            {qual.institution}
                                                        </p>
                                                        <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">
                                                            {qual.year}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-600 dark:text-gray-400">
                                            No qualifications listed
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Experience Tab */}
                            {activeTab === 'experience' && (
                                <div className="space-y-4">
                                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                        <h5 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                                            Total Experience
                                        </h5>
                                        <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                                            {doctor.experience}+ years
                                        </p>
                                    </div>

                                    <div>
                                        <h5 className="font-semibold text-gray-900 dark:text-white mb-2">
                                            Specializations
                                        </h5>
                                        <div className="flex flex-wrap gap-2">
                                            {doctor.specialization?.map((spec, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300 rounded-full text-sm font-semibold capitalize"
                                                >
                                                    {spec}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 dark:border-gray-700 p-6 flex gap-3">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onClose}
                        className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        Close
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                        <MessageSquare className="w-5 h-5" />
                        Book Appointment
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default DoctorDetailModal;
