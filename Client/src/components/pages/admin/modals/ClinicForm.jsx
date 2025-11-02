import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    X,
    Plus,
    Trash2,
    AlertCircle,
    CheckCircle,
} from 'lucide-react';
import { useClinic } from '../../../hooks/useClinic';

const ClinicForm = ({ isOpen, onClose, onSuccess, editClinic = null }) => {
    const { handleCreateClinic, handleUpdateClinic, isLoading, error, message } = useClinic();

    const [formData, setFormData] = useState(
        editClinic || {
            name: '',
            phone: '',
            email: '',
            address: {
                street: '',
                city: '',
                state: '',
                zipCode: '',
                country: 'India',
            },
            facilities: [],
            workingHours: {
                monday: { start: '09:00', end: '18:00' },
                tuesday: { start: '09:00', end: '18:00' },
                wednesday: { start: '09:00', end: '18:00' },
                thursday: { start: '09:00', end: '18:00' },
                friday: { start: '09:00', end: '18:00' },
                saturday: { start: '10:00', end: '16:00' },
                sunday: { start: 'Closed', end: 'Closed' },
            },
        }
    );

    const [errors, setErrors] = useState({});
    const [newFacility, setNewFacility] = useState('');
    const [localSuccess, setLocalSuccess] = useState(false);

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

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            address: {
                ...prev.address,
                [name]: value,
            },
        }));

        if (errors[`address.${name}`]) {
            setErrors((prev) => ({ ...prev, [`address.${name}`]: '' }));
        }
    };

    const handleWorkingHoursChange = (day, field, value) => {
        setFormData((prev) => ({
            ...prev,
            workingHours: {
                ...prev.workingHours,
                [day]: {
                    ...prev.workingHours[day],
                    [field]: value,
                },
            },
        }));
    };

    const handleAddFacility = () => {
        if (newFacility.trim()) {
            setFormData((prev) => ({
                ...prev,
                facilities: [...prev.facilities, newFacility.trim()],
            }));
            setNewFacility('');
        }
    };

    const handleRemoveFacility = (index) => {
        setFormData((prev) => ({
            ...prev,
            facilities: prev.facilities.filter((_, i) => i !== index),
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name?.trim()) newErrors.name = 'Clinic name is required';
        if (!formData.phone?.trim()) newErrors.phone = 'Phone is required';
        if (!formData.address?.street?.trim()) newErrors['address.street'] = 'Street is required';
        if (!formData.address?.city?.trim()) newErrors['address.city'] = 'City is required';
        if (!formData.address?.state?.trim()) newErrors['address.state'] = 'State is required';
        if (!formData.address?.zipCode?.trim()) newErrors['address.zipCode'] = 'Zip code is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        if (editClinic) {
            const result = await handleUpdateClinic(editClinic._id, formData);
            if (result.payload) {
                setLocalSuccess(true);
                setTimeout(() => {
                    onSuccess();
                }, 1500);
            }
        } else {
            const result = await handleCreateClinic(formData);
            if (result.payload) {
                setLocalSuccess(true);
                setTimeout(() => {
                    onSuccess();
                }, 1500);
            }
        }
    };

    if (!isOpen) return null;

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

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
                        {editClinic ? 'Edit Clinic' : 'Create New Clinic'}
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
                    {/* Basic Info */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Basic Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Clinic Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="City Hospital"
                                    className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none ${errors.name
                                        ? 'border-red-400'
                                        : 'border-gray-300 dark:border-gray-600'
                                        }`}
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Phone *
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="1234567890"
                                    className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none ${errors.phone
                                        ? 'border-red-400'
                                        : 'border-gray-300 dark:border-gray-600'
                                        }`}
                                />
                                {errors.phone && (
                                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.phone}</p>
                                )}
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="clinic@example.com"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Address
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Street *
                                </label>
                                <input
                                    type="text"
                                    name="street"
                                    value={formData.address.street}
                                    onChange={handleAddressChange}
                                    placeholder="123 Main Street"
                                    className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none ${errors['address.street']
                                        ? 'border-red-400'
                                        : 'border-gray-300 dark:border-gray-600'
                                        }`}
                                />
                                {errors['address.street'] && (
                                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors['address.street']}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        City *
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.address.city}
                                        onChange={handleAddressChange}
                                        placeholder="Mumbai"
                                        className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none ${errors['address.city']
                                            ? 'border-red-400'
                                            : 'border-gray-300 dark:border-gray-600'
                                            }`}
                                    />
                                    {errors['address.city'] && (
                                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors['address.city']}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        State *
                                    </label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.address.state}
                                        onChange={handleAddressChange}
                                        placeholder="Maharashtra"
                                        className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none ${errors['address.state']
                                            ? 'border-red-400'
                                            : 'border-gray-300 dark:border-gray-600'
                                            }`}
                                    />
                                    {errors['address.state'] && (
                                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors['address.state']}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Zip Code *
                                    </label>
                                    <input
                                        type="text"
                                        name="zipCode"
                                        value={formData.address.zipCode}
                                        onChange={handleAddressChange}
                                        placeholder="400001"
                                        className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none ${errors['address.zipCode']
                                            ? 'border-red-400'
                                            : 'border-gray-300 dark:border-gray-600'
                                            }`}
                                    />
                                    {errors['address.zipCode'] && (
                                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors['address.zipCode']}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Country
                                    </label>
                                    <input
                                        type="text"
                                        name="country"
                                        value={formData.address.country}
                                        onChange={handleAddressChange}
                                        placeholder="India"
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Facilities */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Facilities
                        </h3>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                value={newFacility}
                                onChange={(e) => setNewFacility(e.target.value)}
                                placeholder="e.g., Emergency, ICU, Lab"
                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="button"
                                onClick={handleAddFacility}
                                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-1"
                            >
                                <Plus className="w-4 h-4" />
                                Add
                            </motion.button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.facilities.map((facility, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex items-center gap-2 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full"
                                >
                                    <span className="text-sm font-semibold">{facility}</span>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        type="button"
                                        onClick={() => handleRemoveFacility(index)}
                                        className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </motion.button>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Working Hours */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Working Hours
                        </h3>
                        <div className="space-y-3 max-h-48 overflow-y-auto">
                            {days.map((day) => (
                                <div key={day} className="flex items-center gap-3">
                                    <span className="w-24 font-semibold text-gray-700 dark:text-gray-300 capitalize">
                                        {day}:
                                    </span>
                                    <input
                                        type="time"
                                        value={formData.workingHours[day].start || ''}
                                        onChange={(e) =>
                                            handleWorkingHoursChange(day, 'start', e.target.value)
                                        }
                                        disabled={formData.workingHours[day].start === 'Closed'}
                                        className="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm disabled:opacity-50"
                                    />
                                    <span className="text-gray-600 dark:text-gray-400">to</span>
                                    <input
                                        type="time"
                                        value={formData.workingHours[day].end || ''}
                                        onChange={(e) =>
                                            handleWorkingHoursChange(day, 'end', e.target.value)
                                        }
                                        disabled={formData.workingHours[day].start === 'Closed'}
                                        className="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm disabled:opacity-50"
                                    />
                                </div>
                            ))}
                        </div>
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
                                <span>{editClinic ? 'Update Clinic' : 'Create Clinic'}</span>
                            )}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default ClinicForm;
