import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Edit2,
    Trash2,
    Eye,
    CheckCircle,
    X,
    AlertCircle,
} from 'lucide-react';
import DoctorViewModal from './modals/DoctorViewModal';
import DoctorEditModal from './modals/DoctorEditModal';
import DoctorDeleteModal from './modals/DoctorDeleteModal';

const DoctorList = ({ doctors, onRefresh }) => {
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
        },
    };

    // ✅ Handle View Doctor
    const handleView = (doctor) => {
        setSelectedDoctor(doctor);
        setViewModalOpen(true);
    };

    // ✅ Handle Edit Doctor
    const handleEdit = (doctor) => {
        setSelectedDoctor(doctor);
        setEditModalOpen(true);
    };

    // ✅ Handle Delete Doctor
    const handleDelete = (doctor) => {
        setSelectedDoctor(doctor);
        setDeleteModalOpen(true);
    };

    // ✅ Handle Modal Close
    const handleCloseModals = () => {
        setViewModalOpen(false);
        setEditModalOpen(false);
        setDeleteModalOpen(false);
        setSelectedDoctor(null);
    };

    // ✅ Handle Action Success
    const handleActionSuccess = () => {
        handleCloseModals();
        if (onRefresh) {
            onRefresh();
        }
    };

    return (
        <>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                className="grid gap-4"
            >
                {doctors.length === 0 ? (
                    <motion.div
                        variants={itemVariants}
                        className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl"
                    >
                        <p className="text-gray-600 dark:text-gray-400">No doctors found</p>
                    </motion.div>
                ) : (
                    doctors.map((doctor) => (
                        <motion.div
                            key={doctor._id}
                            variants={itemVariants}
                            whileHover={{ scale: 1.02, y: -2 }}
                            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all"
                        >
                            <div className="flex items-start gap-6">
                                {/* Doctor Image */}
                                <img
                                    src={doctor.profileImage?.url || '/placeholder.jpg'}
                                    alt={doctor.userId?.name}
                                    className="w-24 h-24 rounded-lg object-cover flex-shrink-0 border-2 border-gray-200 dark:border-gray-700"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/100?text=Doctor';
                                    }}
                                />

                                {/* Doctor Info */}
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white">
                                                {doctor.userId?.name}
                                            </h3>
                                            <p className="text-primary-600 dark:text-primary-400 font-semibold capitalize">
                                                {doctor.specialization?.join(', ')}
                                            </p>
                                        </div>

                                        {doctor.isVerified && (
                                            <span className="flex items-center space-x-1 px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full">
                                                <CheckCircle className="w-4 h-4" />
                                                <span className="text-sm font-semibold">Verified</span>
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                                        {doctor.bio || 'No bio available'}
                                    </p>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-600 dark:text-gray-400 block">Experience</span>
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                {doctor.experience} years
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-gray-600 dark:text-gray-400 block">License</span>
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                {doctor.licenseNumber}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-gray-600 dark:text-gray-400 block">Fee</span>
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                ₹{doctor.consultationFee}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-gray-600 dark:text-gray-400 block">Rating</span>
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                {doctor.rating?.toFixed(1) || '0.0'} ⭐
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-2">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleView(doctor)}
                                        className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg transition-colors"
                                        title="View Details"
                                    >
                                        <Eye className="w-5 h-5" />
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleEdit(doctor)}
                                        className="p-2 hover:bg-amber-50 dark:hover:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <Edit2 className="w-5 h-5" />
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleDelete(doctor)}
                                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                                        title="Deactivate"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </motion.div>

            {/* Modals */}
            <AnimatePresence>
                {viewModalOpen && selectedDoctor && (
                    <DoctorViewModal
                        doctor={selectedDoctor}
                        isOpen={viewModalOpen}
                        onClose={handleCloseModals}
                    />
                )}

                {editModalOpen && selectedDoctor && (
                    <DoctorEditModal
                        doctor={selectedDoctor}
                        isOpen={editModalOpen}
                        onClose={handleCloseModals}
                        onSuccess={handleActionSuccess}
                    />
                )}

                {deleteModalOpen && selectedDoctor && (
                    <DoctorDeleteModal
                        doctor={selectedDoctor}
                        isOpen={deleteModalOpen}
                        onClose={handleCloseModals}
                        onSuccess={handleActionSuccess}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default DoctorList;
