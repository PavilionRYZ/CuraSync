import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Edit2,
    Trash2,
    Eye,
    CheckCircle,
    Clock,
    MapPin,
    Award,
    Loader,
} from 'lucide-react';
import AffiliationViewModal from './modals/AffiliationViewModal';
import AffiliationDeleteModal from './modals/AffiliationDeleteModal';
import { useDoctor } from '../../hooks/useDoctor';


const AffiliationList = ({
    affiliations,
    doctors,
    clinics,
    onEdit,
    onRefresh,
}) => {
    const {
        selectedDoctor,
        profileLoading,
        handleGetDoctorById,
    } = useDoctor();

    const [selectedAffiliation, setSelectedAffiliation] = useState(null);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [doctorCache, setDoctorCache] = useState({});
    const [loadingDoctors, setLoadingDoctors] = useState(new Set());

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
        },
    };

    // ✅ Fetch doctor details when needed
    const fetchDoctorDetails = async (doctorId) => {
        // Check if already cached
        if (doctorCache[doctorId]) {
            return doctorCache[doctorId];
        }

        // Mark as loading
        setLoadingDoctors((prev) => new Set([...prev, doctorId]));

        try {
            const result = await handleGetDoctorById(doctorId);

            if (result.payload) {
                // Cache the doctor data
                setDoctorCache((prev) => ({
                    ...prev,
                    [doctorId]: result.payload,
                }));
                return result.payload;
            }
        } catch (error) {
            console.error('Error fetching doctor:', error);
        } finally {
            setLoadingDoctors((prev) => {
                const updated = new Set(prev);
                updated.delete(doctorId);
                return updated;
            });
        }
    };

    // ✅ Pre-fetch all doctor data on component mount
    useEffect(() => {
        const fetchAllDoctors = async () => {
            const uniqueDoctorIds = [
                ...new Set(affiliations.map((aff) => aff.doctorId?._id).filter(Boolean)),
            ];

            for (const doctorId of uniqueDoctorIds) {
                if (!doctorCache[doctorId]) {
                    await fetchDoctorDetails(doctorId);
                }
            }
        };

        fetchAllDoctors();
    }, [affiliations]);

    // ✅ Get doctor details from cache or fetch
    const getDoctorInfo = (doctorId) => {
        return doctorCache[doctorId] || null;
    };

    const handleView = (aff) => {
        setSelectedAffiliation(aff);
        setViewModalOpen(true);
    };

    const handleDelete = (aff) => {
        setSelectedAffiliation(aff);
        setDeleteModalOpen(true);
    };

    const handleCloseModals = () => {
        setViewModalOpen(false);
        setDeleteModalOpen(false);
        setSelectedAffiliation(null);
    };

    const handleActionSuccess = () => {
        handleCloseModals();
        if (onRefresh) {
            onRefresh();
        }
    };

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
        <>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                className="grid gap-4"
            >
                {affiliations.length === 0 ? (
                    <motion.div
                        variants={itemVariants}
                        className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl"
                    >
                        <Award className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700 mb-3" />
                        <p className="text-gray-600 dark:text-gray-400">
                            No affiliations found
                        </p>
                    </motion.div>
                ) : (
                    affiliations.map((aff) => {
                        const doctorInfo = getDoctorInfo(aff.doctorId?._id);
                        const isLoading = loadingDoctors.has(aff.doctorId?._id);

                        // Fallback to inline data if available
                        const displayName = doctorInfo?.userId?.name || aff.doctorId?.userId?.name || 'Loading...';
                        const displaySpecialization = doctorInfo?.specialization || aff.doctorId?.specialization || [];
                        const displayImage = doctorInfo?.profileImage?.url || aff.doctorId?.profileImage?.url || '/placeholder.jpg';
                        const displayExperience = doctorInfo?.experience || aff.doctorId?.experience || 0;
                        const displayRating = doctorInfo?.rating || aff.doctorId?.rating || 0;

                        return (
                            <motion.div
                                key={aff._id}
                                variants={itemVariants}
                                whileHover={{ scale: 1.02, y: -2 }}
                                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    {/* Doctor Info with Image */}
                                    <div className="flex items-start gap-4 flex-1">
                                        {/* Doctor Image */}
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            className="relative flex-shrink-0"
                                        >
                                            <img
                                                src={displayImage}
                                                alt={displayName}
                                                className="w-20 h-20 rounded-lg object-cover border-2 border-primary-200 dark:border-primary-800 shadow-md"
                                                onError={(e) => {
                                                    e.target.src =
                                                        'https://via.placeholder.com/100?text=Doctor';
                                                }}
                                            />
                                            {isLoading && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                                                    <Loader className="w-5 h-5 text-white animate-spin" />
                                                </div>
                                            )}
                                        </motion.div>

                                        {/* Doctor Details */}
                                        <div className="flex-1">
                                            <motion.h3
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="text-xl font-heading font-bold text-gray-900 dark:text-white"
                                            >
                                                {isLoading && displayName === 'Loading...' ? (
                                                    <span className="flex items-center gap-2">
                                                        <Loader className="w-4 h-4 animate-spin" />
                                                        Fetching...
                                                    </span>
                                                ) : (
                                                    displayName
                                                )}
                                            </motion.h3>

                                            <p className="text-primary-600 dark:text-primary-400 font-semibold capitalize">
                                                {Array.isArray(displaySpecialization)
                                                    ? displaySpecialization.join(', ')
                                                    : displaySpecialization}
                                            </p>

                                            <div className="mt-2 space-y-1">
                                                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {aff.clinicId?.name}
                                                </p>
                                                {aff.department && (
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        Department: {aff.department}
                                                        {aff.roomNumber && ` • Room ${aff.roomNumber}`}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="flex items-center gap-2">
                                        {aff.status === 'active' ? (
                                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-semibold whitespace-nowrap">
                                                <CheckCircle className="w-4 h-4" />
                                                Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-semibold whitespace-nowrap">
                                                Inactive
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Details Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 py-4 border-y border-gray-200 dark:border-gray-700">
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                                            Consultation Fee
                                        </span>
                                        <p className="text-lg font-bold text-blue-700 dark:text-blue-300 mt-1">
                                            ₹{aff.consultationFee}
                                        </p>
                                    </div>

                                    <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                                        <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            Working Hours
                                        </span>
                                        <p className="text-lg font-bold text-purple-700 dark:text-purple-300 mt-1">
                                            {aff.workingHours?.start}-{aff.workingHours?.end}
                                        </p>
                                    </div>

                                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                                        <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                                            Experience
                                        </span>
                                        <p className="text-lg font-bold text-green-700 dark:text-green-300 mt-1">
                                            {displayExperience}+ yrs
                                        </p>
                                    </div>

                                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                                        <span className="text-xs font-semibold text-yellow-600 dark:text-yellow-400">
                                            Rating
                                        </span>
                                        <p className="text-lg font-bold text-yellow-700 dark:text-yellow-300 mt-1">
                                            {displayRating.toFixed(1) || 'N/A'} ⭐
                                        </p>
                                    </div>
                                </div>

                                {/* Working Days */}
                                <div className="mb-4">
                                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                                        Working Days:
                                    </span>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {days.map((day) => (
                                            <span
                                                key={day}
                                                className={`px-2 py-1 text-xs rounded capitalize font-semibold transition-all ${aff.workingDays?.includes(day)
                                                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-500 opacity-50'
                                                    }`}
                                            >
                                                {day.slice(0, 3)}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Clinic Info */}
                                <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                                        Clinic Location
                                    </p>
                                    <p className="text-sm text-gray-900 dark:text-white font-semibold">
                                        {aff.clinicId?.address?.street}, {aff.clinicId?.address?.city}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleView(aff)}
                                        className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg transition-colors"
                                        title="View Details"
                                    >
                                        <Eye className="w-5 h-5" />
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => onEdit(aff)}
                                        className="p-2 hover:bg-amber-50 dark:hover:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <Edit2 className="w-5 h-5" />
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleDelete(aff)}
                                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </motion.button>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </motion.div>

            {/* Modals */}
            <AnimatePresence>
                {viewModalOpen && selectedAffiliation && (
                    <AffiliationViewModal
                        affiliation={selectedAffiliation}
                        isOpen={viewModalOpen}
                        onClose={handleCloseModals}
                    />
                )}

                {deleteModalOpen && selectedAffiliation && (
                    <AffiliationDeleteModal
                        affiliation={selectedAffiliation}
                        isOpen={deleteModalOpen}
                        onClose={handleCloseModals}
                        onSuccess={handleActionSuccess}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default AffiliationList;

