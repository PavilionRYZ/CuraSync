import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Edit2,
    Trash2,
    Eye,
    MapPin,
    Phone,
    Mail,
    Clock,
} from 'lucide-react';
import ClinicViewModal from './modals/ClinicViewModal';
import ClinicEditModal from './modals/ClinicEditModal';
import ClinicDeleteModal from './modals/ClinicDeleteModal';

const ClinicList = ({ clinics, onRefresh }) => {
    const [selectedClinic, setSelectedClinic] = useState(null);
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

    const handleView = (clinic) => {
        setSelectedClinic(clinic);
        setViewModalOpen(true);
    };

    const handleEdit = (clinic) => {
        setSelectedClinic(clinic);
        setEditModalOpen(true);
    };

    const handleDelete = (clinic) => {
        setSelectedClinic(clinic);
        setDeleteModalOpen(true);
    };

    const handleCloseModals = () => {
        setViewModalOpen(false);
        setEditModalOpen(false);
        setDeleteModalOpen(false);
        setSelectedClinic(null);
    };

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
                {clinics.length === 0 ? (
                    <motion.div
                        variants={itemVariants}
                        className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl"
                    >
                        <p className="text-gray-600 dark:text-gray-400">No clinics found</p>
                    </motion.div>
                ) : (
                    clinics.map((clinic) => (
                        <motion.div
                            key={clinic._id}
                            variants={itemVariants}
                            whileHover={{ scale: 1.02, y: -2 }}
                            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white">
                                        {clinic.name}
                                    </h3>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
                                            {clinic.address?.city}, {clinic.address?.state}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Phone className="w-4 h-4" />
                                            {clinic.phone}
                                        </span>
                                        {clinic.email && (
                                            <span className="flex items-center gap-1">
                                                <Mail className="w-4 h-4" />
                                                {clinic.email}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-2">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleView(clinic)}
                                        className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg transition-colors"
                                        title="View Details"
                                    >
                                        <Eye className="w-5 h-5" />
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleEdit(clinic)}
                                        className="p-2 hover:bg-amber-50 dark:hover:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <Edit2 className="w-5 h-5" />
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleDelete(clinic)}
                                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                                        title="Deactivate"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </motion.button>
                                </div>
                            </div>

                            {/* Facilities */}
                            <div className="mt-4">
                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Facilities:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {clinic.facilities?.slice(0, 4).map((facility, index) => (
                                        <span
                                            key={index}
                                            className="px-2 py-1 text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full"
                                        >
                                            {facility}
                                        </span>
                                    ))}
                                    {clinic.facilities?.length > 4 && (
                                        <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                                            +{clinic.facilities.length - 4} more
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Address */}
                            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                                <p className="line-clamp-1">
                                    {clinic.address?.street}, {clinic.address?.city} - {clinic.address?.zipCode}
                                </p>
                            </div>
                        </motion.div>
                    ))
                )}
            </motion.div>

            {/* Modals */}
            <AnimatePresence>
                {viewModalOpen && selectedClinic && (
                    <ClinicViewModal
                        clinic={selectedClinic}
                        isOpen={viewModalOpen}
                        onClose={handleCloseModals}
                    />
                )}

                {editModalOpen && selectedClinic && (
                    <ClinicEditModal
                        clinic={selectedClinic}
                        isOpen={editModalOpen}
                        onClose={handleCloseModals}
                        onSuccess={handleActionSuccess}
                    />
                )}

                {deleteModalOpen && selectedClinic && (
                    <ClinicDeleteModal
                        clinic={selectedClinic}
                        isOpen={deleteModalOpen}
                        onClose={handleCloseModals}
                        onSuccess={handleActionSuccess}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default ClinicList;
