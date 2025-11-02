import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Eye,
    MapPin,
    Phone,
    Filter,
    Download,
    X,
    AlertCircle,
} from 'lucide-react';
import { useClinic } from '../../hooks/useClinic';
import ClinicForm from './modals/ClinicForm';
import ClinicList from './ClinicList';
import Loading from '../Loading';

const ClinicManagement = () => {
    const {
        clinics,
        isLoading,
        error,
        pagination,
        handleGetAllClinics,
        handleClearError,
    } = useClinic();

    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCity, setFilterCity] = useState('');
    const [filterState, setFilterState] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        handleGetAllClinics({
            city: filterCity,
            state: filterState,
            search: searchTerm,
            page: currentPage,
            limit: 10,
        });
    }, []);

    const handleSearch = () => {
        setCurrentPage(1);
        handleGetAllClinics({
            city: filterCity,
            state: filterState,
            search: searchTerm,
            page: 1,
            limit: 10,
        });
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        handleGetAllClinics({
            city: filterCity,
            state: filterState,
            search: searchTerm,
            page: newPage,
            limit: 10,
        });
    };

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
                        Clinic Management
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Manage and create clinics across your network
                    </p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowForm(true)}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add Clinic</span>
                </motion.button>
            </motion.div>

            {/* Error Alert */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center justify-between"
                >
                    <div className="flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        <p className="text-red-800 dark:text-red-300">{error}</p>
                    </div>
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
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                    {/* Search */}
                    <div className="relative md:col-span-2">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by clinic name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                        />
                    </div>

                    {/* City Filter */}
                    <input
                        type="text"
                        placeholder="Filter by city..."
                        value={filterCity}
                        onChange={(e) => setFilterCity(e.target.value)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    />

                    {/* State Filter */}
                    <input
                        type="text"
                        placeholder="Filter by state..."
                        value={filterState}
                        onChange={(e) => setFilterState(e.target.value)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    />

                    {/* Search Button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSearch}
                        className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <Filter className="w-4 h-4" />
                        <span>Search</span>
                    </motion.button>
                </div>

                {/* Results Info */}
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Total: {pagination.total} clinics</span>
                    <button className="flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
                        <Download className="w-4 h-4" />
                        <span>Export</span>
                    </button>
                </div>
            </motion.div>

            {/* Clinic List */}
            {isLoading ? (
                <Loading fullPage={false} message="Loading clinics..." />
            ) : (
                <ClinicList clinics={clinics} onRefresh={() => handleSearch()} />
            )}

            {/* Pagination */}
            {!isLoading && pagination.pages > 1 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-2 mt-6"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        Previous
                    </motion.button>

                    <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                            let pageNum;
                            if (pagination.pages <= 5) {
                                pageNum = i + 1;
                            } else if (currentPage <= 3) {
                                pageNum = i + 1;
                            } else if (currentPage >= pagination.pages - 2) {
                                pageNum = pagination.pages - 4 + i;
                            } else {
                                pageNum = currentPage - 2 + i;
                            }

                            return (
                                <motion.button
                                    key={pageNum}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handlePageChange(pageNum)}
                                    className={`px-3 py-2 rounded-lg font-semibold transition-all ${currentPage === pageNum
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                        }`}
                                >
                                    {pageNum}
                                </motion.button>
                            );
                        })}
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePageChange(Math.min(pagination.pages, currentPage + 1))}
                        disabled={currentPage === pagination.pages}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        Next
                    </motion.button>

                    <span className="text-sm text-gray-600 dark:text-gray-400 ml-4">
                        Page {currentPage} of {pagination.pages}
                    </span>
                </motion.div>
            )}

            {/* Clinic Form Modal */}
            <AnimatePresence>
                {showForm && (
                    <ClinicForm
                        isOpen={showForm}
                        onClose={() => setShowForm(false)}
                        onSuccess={() => {
                            setShowForm(false);
                            handleSearch();
                        }}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ClinicManagement;
