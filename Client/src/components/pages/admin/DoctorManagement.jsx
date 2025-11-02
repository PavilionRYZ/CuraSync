import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Eye,
    CheckCircle,
    X,
    Filter,
    Download,
} from 'lucide-react';
import { useDoctor } from '../../hooks/useDoctor';
import DoctorForm from './DoctorForm';
import DoctorList from './DoctorList';
import Loading from '../Loading';

const DoctorManagement = () => {
    const {
        doctors,
        isLoading,
        error,
        handleGetAllDoctors,
        handleClearError,
    } = useDoctor();

    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSpecialization, setFilterSpecialization] = useState('');
    const [filterVerified, setFilterVerified] = useState('');

    useEffect(() => {
        handleGetAllDoctors();
    }, []);

    const filteredDoctors = doctors.filter((doctor) => {
        const matchesSearch =
            doctor.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.specialization?.some((s) =>
                s.toLowerCase().includes(searchTerm.toLowerCase())
            );

        const matchesSpecialization =
            !filterSpecialization ||
            doctor.specialization?.includes(filterSpecialization);

        const matchesVerified =
            !filterVerified ||
            (filterVerified === 'verified' ? doctor.isVerified : !doctor.isVerified);

        return matchesSearch && matchesSpecialization && matchesVerified;
    });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
        >
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
                <div>
                    <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
                        Doctor Management
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Manage and register doctors in the system
                    </p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowForm(true)}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                    <Plus className="w-5 h-5" />
                    <span>Register Doctor</span>
                </motion.button>
            </motion.div>

            {/* Error Alert */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center justify-between"
                >
                    <p className="text-red-800 dark:text-red-300">{error}</p>
                    <button
                        onClick={() => handleClearError()}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </motion.div>
            )}

            {/* Filters & Search */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="relative md:col-span-2">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or specialization..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                        />
                    </div>

                    {/* Specialization Filter */}
                    <select
                        value={filterSpecialization}
                        onChange={(e) => setFilterSpecialization(e.target.value)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                    >
                        <option value="">All Specializations</option>
                        <option value="cardiology">Cardiology</option>
                        <option value="neurology">Neurology</option>
                        <option value="orthopedics">Orthopedics</option>
                        <option value="pediatrics">Pediatrics</option>
                    </select>

                    {/* Verification Filter */}
                    <select
                        value={filterVerified}
                        onChange={(e) => setFilterVerified(e.target.value)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                    >
                        <option value="">All Statuses</option>
                        <option value="verified">Verified</option>
                        <option value="unverified">Unverified</option>
                    </select>
                </div>

                {/* Results Count */}
                <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>{filteredDoctors.length} doctors found</span>
                    <button className="flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
                        <Download className="w-4 h-4" />
                        <span>Export</span>
                    </button>
                </div>
            </motion.div>

            {/* Doctor List */}
            {isLoading ? (
                <Loading fullPage={false} message="Loading doctors..." />
            ) : (
                <DoctorList doctors={filteredDoctors} onRefresh={() => handleGetAllDoctors()} />
            )}

            {/* Doctor Form Modal */}
            <AnimatePresence>
                {showForm && (
                    <DoctorForm
                        isOpen={showForm}
                        onClose={() => setShowForm(false)}
                        onSuccess={() => {
                            setShowForm(false);
                            handleGetAllDoctors();
                        }}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default DoctorManagement;
