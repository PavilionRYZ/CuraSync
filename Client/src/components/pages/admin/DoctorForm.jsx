import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    X,
    Upload,
    Plus,
    Trash2,
    Eye,
    EyeOff,
    AlertCircle,
} from 'lucide-react';
import { useDoctor } from '../../hooks/useDoctor';

const DoctorForm = ({ isOpen, onClose, onSuccess }) => {
    const { handleRegisterDoctor, isLoading, error, message } = useDoctor();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        specialization: [],
        qualifications: [],
        experience: '',
        licenseNumber: '',
        bio: '',
        consultationFee: '',
        languages: [],
        profileImage: null,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [localSuccess, setLocalSuccess] = useState(false);

    // ✅ Handle text input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    // ✅ FIXED: Handle file input correctly
    const handleImageChange = (e) => {
        const file = e.target.files?.[0];

        if (file) {
            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                setErrors((prev) => ({
                    ...prev,
                    profileImage: 'File size must be less than 5MB',
                }));
                return;
            }

            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                setErrors((prev) => ({
                    ...prev,
                    profileImage: 'Only JPEG, PNG, and WebP formats are allowed',
                }));
                return;
            }

            setFormData((prev) => ({
                ...prev,
                profileImage: file, // ✅ Store File object, not FileList
            }));

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);

            // Clear error
            if (errors.profileImage) {
                setErrors((prev) => ({
                    ...prev,
                    profileImage: '',
                }));
            }
        }
    };

    // ✅ Handle specialization addition
    const handleAddSpecialization = () => {
        setFormData((prev) => ({
            ...prev,
            specialization: [...prev.specialization, ''],
        }));
    };

    // ✅ Handle specialization change
    const handleSpecializationChange = (index, value) => {
        const newSpecs = [...formData.specialization];
        newSpecs[index] = value;
        setFormData((prev) => ({
            ...prev,
            specialization: newSpecs,
        }));
    };

    // ✅ Handle specialization removal
    const handleRemoveSpecialization = (index) => {
        const newSpecs = formData.specialization.filter((_, i) => i !== index);
        setFormData((prev) => ({
            ...prev,
            specialization: newSpecs,
        }));
    };

    // ✅ Handle qualification addition
    const handleAddQualification = () => {
        setFormData((prev) => ({
            ...prev,
            qualifications: [
                ...prev.qualifications,
                { degree: '', institution: '', year: '' },
            ],
        }));
    };

    // ✅ Handle qualification change
    const handleQualificationChange = (index, field, value) => {
        const newQuals = [...formData.qualifications];
        newQuals[index] = {
            ...newQuals[index],
            [field]: value,
        };
        setFormData((prev) => ({
            ...prev,
            qualifications: newQuals,
        }));
    };

    // ✅ Handle qualification removal
    const handleRemoveQualification = (index) => {
        const newQuals = formData.qualifications.filter((_, i) => i !== index);
        setFormData((prev) => ({
            ...prev,
            qualifications: newQuals,
        }));
    };

    // ✅ Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!formData.name?.trim()) newErrors.name = 'Name is required';
        if (!formData.email?.trim()) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
            newErrors.email = 'Invalid email format';

        if (!formData.phone?.trim()) newErrors.phone = 'Phone is required';
        else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\D/g, '')))
            newErrors.phone = 'Phone must be 10 digits';

        if (!formData.password?.trim()) newErrors.password = 'Password is required';
        else if (formData.password.length < 6)
            newErrors.password = 'Password must be at least 6 characters';

        if (formData.specialization.length === 0)
            newErrors.specialization = 'At least one specialization is required';
        else if (formData.specialization.some((s) => !s?.trim()))
            newErrors.specialization = 'Specialization cannot be empty';

        if (!formData.experience?.trim())
            newErrors.experience = 'Experience is required';
        else if (isNaN(formData.experience) || formData.experience < 0)
            newErrors.experience = 'Experience must be a valid number';

        if (!formData.licenseNumber?.trim())
            newErrors.licenseNumber = 'License number is required';

        if (!formData.profileImage) newErrors.profileImage = 'Profile image is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ✅ Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        // ✅ FIXED: Create FormData correctly
        const registerData = new FormData();
        registerData.append('name', formData.name.trim());
        registerData.append('email', formData.email.trim());
        registerData.append('phone', formData.phone.replace(/\D/g, ''));
        registerData.append('password', formData.password);

        // ✅ Send arrays directly, NOT stringified
        formData.specialization.forEach((spec, index) => {
            registerData.append(`specialization[${index}]`, spec.trim().toLowerCase());
        });

        // ✅ Send qualifications as objects
        formData.qualifications.forEach((qual, index) => {
            registerData.append(`qualifications[${index}][degree]`, qual.degree);
            registerData.append(`qualifications[${index}][institution]`, qual.institution);
            registerData.append(`qualifications[${index}][year]`, qual.year);
        });

        registerData.append('experience', parseInt(formData.experience));
        registerData.append('licenseNumber', formData.licenseNumber.trim().toUpperCase());
        registerData.append('bio', formData.bio.trim());
        registerData.append('consultationFee', parseFloat(formData.consultationFee) || 0);
        registerData.append('isVerified', 'true');

        // ✅ Append profile image (most important!)
        if (formData.profileImage instanceof File) {
            registerData.append('profileImage', formData.profileImage);
        }

        // ✅ Languages (optional)
        if (formData.languages.length > 0) {
            formData.languages.forEach((lang, index) => {
                registerData.append(`languages[${index}]`, lang);
            });
        }

        const result = await handleRegisterDoctor(registerData);

        if (result.payload?.doctor) {
            setLocalSuccess(true);
            // Reset form
            setTimeout(() => {
                resetForm();
                onSuccess();
            }, 1500);
        }
    };

    // ✅ Reset form to initial state
    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            phone: '',
            password: '',
            specialization: [],
            qualifications: [],
            experience: '',
            licenseNumber: '',
            bio: '',
            consultationFee: '',
            languages: [],
            profileImage: null,
        });
        setImagePreview(null);
        setErrors({});
        setShowPassword(false);
        setLocalSuccess(false);
    };

    // ✅ Handle modal close
    const handleClose = () => {
        resetForm();
        onClose();
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
                className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full shadow-2xl my-8"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
                    <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
                        Register New Doctor
                    </h2>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleClose}
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
                        className="mx-6 mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3"
                    >
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <p className="text-green-800 dark:text-green-300">{message}</p>
                    </motion.div>
                )}

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
                <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-96 overflow-y-auto">
                    {/* Profile Image - ✅ FIXED */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Profile Image *
                        </label>
                        <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-primary-500 transition-colors cursor-pointer group">
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleImageChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            {imagePreview ? (
                                <div className="space-y-2">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-20 h-20 mx-auto rounded-lg object-cover border-2 border-primary-400"
                                    />
                                    <p className="text-sm text-primary-600 dark:text-primary-400 font-semibold">
                                        Image selected
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <Upload className="w-8 h-8 mx-auto text-gray-400 group-hover:text-primary-500 transition-colors" />
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Click to upload or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-500">
                                        JPG, PNG or WebP (Max 5MB)
                                    </p>
                                </div>
                            )}
                        </div>
                        {errors.profileImage && (
                            <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                {errors.profileImage}
                            </p>
                        )}
                    </div>

                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Dr. John Doe"
                                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all ${errors.name
                                    ? 'border-red-400 focus:border-red-500'
                                    : 'border-gray-300 dark:border-gray-600'
                                    }`}
                            />
                            {errors.name && (
                                <p className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Email *
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="doctor@example.com"
                                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all ${errors.email
                                    ? 'border-red-400 focus:border-red-500'
                                    : 'border-gray-300 dark:border-gray-600'
                                    }`}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.email}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Phone & Password */}
                    <div className="grid grid-cols-2 gap-4">
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
                                maxLength="10"
                                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all ${errors.phone
                                    ? 'border-red-400 focus:border-red-500'
                                    : 'border-gray-300 dark:border-gray-600'
                                    }`}
                            />
                            {errors.phone && (
                                <p className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.phone}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Password *
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all ${errors.password
                                        ? 'border-red-400 focus:border-red-500'
                                        : 'border-gray-300 dark:border-gray-600'
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.password}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* License & Experience */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                License Number *
                            </label>
                            <input
                                type="text"
                                name="licenseNumber"
                                value={formData.licenseNumber}
                                onChange={handleChange}
                                placeholder="LIC-001234"
                                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all ${errors.licenseNumber
                                    ? 'border-red-400 focus:border-red-500'
                                    : 'border-gray-300 dark:border-gray-600'
                                    }`}
                            />
                            {errors.licenseNumber && (
                                <p className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.licenseNumber}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Experience (Years) *
                            </label>
                            <input
                                type="number"
                                name="experience"
                                value={formData.experience}
                                onChange={handleChange}
                                placeholder="10"
                                min="0"
                                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all ${errors.experience
                                    ? 'border-red-400 focus:border-red-500'
                                    : 'border-gray-300 dark:border-gray-600'
                                    }`}
                            />
                            {errors.experience && (
                                <p className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.experience}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Specialization - ✅ IMPROVED */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Specializations * ({formData.specialization.length})
                            </label>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                type="button"
                                onClick={handleAddSpecialization}
                                className="flex items-center space-x-1 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                <span className="text-sm">Add</span>
                            </motion.button>
                        </div>
                        <div className="space-y-2">
                            {formData.specialization.map((spec, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={spec}
                                        onChange={(e) =>
                                            handleSpecializationChange(index, e.target.value)
                                        }
                                        placeholder="e.g., Cardiology"
                                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                    />
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        type="button"
                                        onClick={() =>
                                            handleRemoveSpecialization(index)
                                        }
                                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </motion.button>
                                </div>
                            ))}
                        </div>
                        {errors.specialization && (
                            <p className="text-sm text-red-600 dark:text-red-400 mt-2 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {errors.specialization}
                            </p>
                        )}
                    </div>

                    {/* Qualifications - ✅ NEW & IMPROVED */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Qualifications ({formData.qualifications.length})
                            </label>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                type="button"
                                onClick={handleAddQualification}
                                className="flex items-center space-x-1 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                <span className="text-sm">Add</span>
                            </motion.button>
                        </div>
                        <div className="space-y-3">
                            {formData.qualifications.map((qual, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 space-y-3"
                                >
                                    <div className="grid grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            value={qual.degree}
                                            onChange={(e) =>
                                                handleQualificationChange(index, 'degree', e.target.value)
                                            }
                                            placeholder="e.g., MBBS"
                                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                                        />
                                        <input
                                            type="text"
                                            value={qual.institution}
                                            onChange={(e) =>
                                                handleQualificationChange(
                                                    index,
                                                    'institution',
                                                    e.target.value
                                                )
                                            }
                                            placeholder="e.g., Medical College"
                                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <input
                                            type="number"
                                            value={qual.year}
                                            onChange={(e) =>
                                                handleQualificationChange(index, 'year', e.target.value)
                                            }
                                            placeholder="e.g., 2015"
                                            min="1900"
                                            max={new Date().getFullYear()}
                                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                                        />
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            type="button"
                                            onClick={() =>
                                                handleRemoveQualification(index)
                                            }
                                            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </motion.button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Consultation Fee */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Consultation Fee (₹)
                        </label>
                        <input
                            type="number"
                            name="consultationFee"
                            value={formData.consultationFee}
                            onChange={handleChange}
                            placeholder="500"
                            min="0"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                        />
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
                            placeholder="Brief bio about the doctor..."
                            rows="3"
                            maxLength="1000"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none resize-none transition-all"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {formData.bio.length}/1000 characters
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={handleClose}
                            disabled={isLoading}
                            className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                                    <span>Registering...</span>
                                </>
                            ) : (
                                <span>Register Doctor</span>
                            )}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default DoctorForm;
