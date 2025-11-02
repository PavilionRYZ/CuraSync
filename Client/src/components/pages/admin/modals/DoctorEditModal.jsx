import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, AlertCircle, CheckCircle } from 'lucide-react';
import { useDoctor } from '../../../hooks/useDoctor';

const DoctorEditModal = ({ doctor, isOpen, onClose, onSuccess }) => {
    const { handleUpdateDoctorProfile, isLoading, error } = useDoctor();

    const [formData, setFormData] = useState({
        experience: doctor.experience || '',
        consultationFee: doctor.consultationFee || '',
        bio: doctor.bio || '',
        isVerified: doctor.isVerified || false,
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.experience || formData.experience < 0) {
            newErrors.experience = 'Valid experience is required';
        }

        if (!formData.consultationFee || formData.consultationFee < 0) {
            newErrors.consultationFee = 'Valid consultation fee is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const updateData = {
            experience: parseInt(formData.experience),
            consultationFee: parseFloat(formData.consultationFee),
            bio: formData.bio,
            isVerified: formData.isVerified,
        };

        const result = await handleUpdateDoctorProfile(doctor._id, updateData);

        if (result.payload) {
            onSuccess();
        }
    };

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
                className="bg-white dark:bg-gray-800 rounded-2xl max-w-xl w-full shadow-2xl"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
                        Edit Doctor Profile
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

                {/* Error Alert */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mx-6 mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3"
                    >
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="text-red-800 dark:text-red-300">{error}</p>
                    </motion.div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Doctor Info Display */}
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {doctor.userId?.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {doctor.specialization?.join(', ')}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            License: {doctor.licenseNumber}
                        </p>
                    </div>

                    {/* Experience */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Experience (Years) *
                        </label>
                        <input
                            type="number"
                            name="experience"
                            value={formData.experience}
                            onChange={handleChange}
                            min="0"
                            className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none ${errors.experience
                                ? 'border-red-400'
                                : 'border-gray-300 dark:border-gray-600'
                                }`}
                        />
                        {errors.experience && (
                            <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                                {errors.experience}
                            </p>
                        )}
                    </div>

                    {/* Consultation Fee */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Consultation Fee (₹) *
                        </label>
                        <input
                            type="number"
                            name="consultationFee"
                            value={formData.consultationFee}
                            onChange={handleChange}
                            min="0"
                            className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none ${errors.consultationFee
                                ? 'border-red-400'
                                : 'border-gray-300 dark:border-gray-600'
                                }`}
                        />
                        {errors.consultationFee && (
                            <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                                {errors.consultationFee}
                            </p>
                        )}
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Bio
                        </label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows="4"
                            maxLength="1000"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {formData.bio.length}/1000 characters
                        </p>
                    </div>

                    {/* Verification Status */}
                    <div className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <input
                            type="checkbox"
                            name="isVerified"
                            checked={formData.isVerified}
                            onChange={handleChange}
                            className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <div>
                            <label className="font-semibold text-gray-900 dark:text-white cursor-pointer">
                                Verified Doctor
                            </label>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                Mark this doctor as verified
                            </p>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 pt-4">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Updating...</span>
                                </>
                            ) : (
                                <span>Update Profile</span>
                            )}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default DoctorEditModal;
