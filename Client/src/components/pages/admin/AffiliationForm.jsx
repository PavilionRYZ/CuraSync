import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, AlertCircle, CheckCircle, Plus, Trash2 } from 'lucide-react';
import { useDoctor } from '../../hooks/useDoctor';

const AffiliationForm = ({
    isOpen,
    onClose,
    onSuccess,
    editAffiliation = null,
    doctors = [],
    clinics = [],
}) => {
    const {
        affiliationLoading: isLoading,
        error,
        message,
        handleCreateAffiliation,
        handleUpdateAffiliation,
    } = useDoctor();

    const [formData, setFormData] = useState(
        editAffiliation || {
            doctorId: '',
            clinicId: '',
            consultationFee: '',
            workingDays: [],
            workingHours: {
                start: '09:00',
                end: '18:00',
            },
            roomNumber: '',
            department: '',
            status: 'active',
        }
    );

    const [errors, setErrors] = useState({});
    const [localSuccess, setLocalSuccess] = useState(false);

    const days = [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday',
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleHoursChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            workingHours: {
                ...prev.workingHours,
                [field]: value,
            },
        }));
    };

    const handleDayToggle = (day) => {
        setFormData((prev) => ({
            ...prev,
            workingDays: prev.workingDays.includes(day)
                ? prev.workingDays.filter((d) => d !== day)
                : [...prev.workingDays, day],
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.doctorId) newErrors.doctorId = 'Doctor is required';
        if (!formData.clinicId) newErrors.clinicId = 'Clinic is required';
        if (!formData.consultationFee || formData.consultationFee < 0)
            newErrors.consultationFee = 'Valid consultation fee is required';
        if (formData.workingDays.length === 0)
            newErrors.workingDays = 'Select at least one working day';
        if (!formData.workingHours.start)
            newErrors.start = 'Start time is required';
        if (!formData.workingHours.end) newErrors.end = 'End time is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        if (editAffiliation) {
            const result = await handleUpdateAffiliation({
                affiliationId: editAffiliation._id,
                data: formData,
            });

            if (result.payload) {
                setLocalSuccess(true);
                setTimeout(() => {
                    onSuccess();
                }, 1500);
            }
        } else {
            const result = await handleCreateAffiliation(formData);

            if (result.payload) {
                setLocalSuccess(true);
                setTimeout(() => {
                    onSuccess();
                }, 1500);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white dark:bg-gray-800 rounded-2xl max-w-3xl w-full shadow-2xl my-8"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
                    <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
                        {editAffiliation ? 'Edit Affiliation' : 'Create New Affiliation'}
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

                {/* Success Alert */}
                {localSuccess && message && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mx-6 mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3"
                    >
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <p className="text-green-800 dark:text-green-300">{message}</p>
                    </motion.div>
                )}

                {/* Error Alert */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mx-6 mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3"
                    >
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <p className="text-red-800 dark:text-red-300">{error}</p>
                    </motion.div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-96 overflow-y-auto">
                    {/* Doctor & Clinic Selection */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Doctor *
                            </label>
                            <select
                                name="doctorId"
                                value={formData.doctorId}
                                onChange={handleChange}
                                disabled={editAffiliation}
                                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none disabled:opacity-50 ${errors.doctorId
                                        ? 'border-red-400'
                                        : 'border-gray-300 dark:border-gray-600'
                                    }`}
                            >
                                <option value="">Select Doctor</option>
                                {doctors.map((doctor) => (
                                    <option key={doctor._id} value={doctor._id}>
                                        {doctor.userId?.name} ({doctor.specialization?.join(', ')})
                                    </option>
                                ))}
                            </select>
                            {errors.doctorId && (
                                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                                    {errors.doctorId}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Clinic *
                            </label>
                            <select
                                name="clinicId"
                                value={formData.clinicId}
                                onChange={handleChange}
                                disabled={editAffiliation}
                                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none disabled:opacity-50 ${errors.clinicId
                                        ? 'border-red-400'
                                        : 'border-gray-300 dark:border-gray-600'
                                    }`}
                            >
                                <option value="">Select Clinic</option>
                                {clinics.map((clinic) => (
                                    <option key={clinic._id} value={clinic._id}>
                                        {clinic.name} ({clinic.address?.city})
                                    </option>
                                ))}
                            </select>
                            {errors.clinicId && (
                                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                                    {errors.clinicId}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Consultation Fee & Status */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Consultation Fee (₹) *
                            </label>
                            <input
                                type="number"
                                name="consultationFee"
                                value={formData.consultationFee}
                                onChange={handleChange}
                                placeholder="500"
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

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Status
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    {/* Room & Department */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Room Number
                            </label>
                            <input
                                type="text"
                                name="roomNumber"
                                value={formData.roomNumber}
                                onChange={handleChange}
                                placeholder="Room 101"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Department
                            </label>
                            <input
                                type="text"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                placeholder="Cardiology"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                        </div>
                    </div>

                    {/* Working Hours */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                            Working Hours
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                                    Start Time
                                </label>
                                <input
                                    type="time"
                                    value={formData.workingHours.start}
                                    onChange={(e) => handleHoursChange('start', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                                    End Time
                                </label>
                                <input
                                    type="time"
                                    value={formData.workingHours.end}
                                    onChange={(e) => handleHoursChange('end', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Working Days */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                            Working Days *
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {days.map((day) => (
                                <motion.button
                                    key={day}
                                    type="button"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleDayToggle(day)}
                                    className={`px-3 py-2 rounded-lg font-semibold capitalize transition-all ${formData.workingDays.includes(day)
                                            ? 'bg-primary-600 text-white'
                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                        }`}
                                >
                                    {day.slice(0, 3)}
                                </motion.button>
                            ))}
                        </div>
                        {errors.workingDays && (
                            <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                                {errors.workingDays}
                            </p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
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
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <span>
                                    {editAffiliation ? 'Update Affiliation' : 'Create Affiliation'}
                                </span>
                            )}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default AffiliationForm;
