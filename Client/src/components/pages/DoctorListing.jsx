import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    MapPin,
    Star,
    Filter,
    ChevronDown,
    X,
    Award,
    Clock,
    Users,
    BarChart3,
} from 'lucide-react';
import { useDoctor } from '../hooks/useDoctor';
import DoctorCard from './public/DoctorCard';
import DoctorDetailModal from './public/DoctorDetailModal';
import Loading from './Loading';

const DoctorListing = () => {
    const {
        doctors,
        isLoading,
        error,
        pagination,
        filters,
        handleGetAllDoctors,
        handleSetFilters,
        handleClearFilters,
    } = useDoctor();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState('rating');

    // Available specializations
    const specializations = [
        'Cardiology',
        'Neurology',
        'Orthopedics',
        'Pediatrics',
        'Dermatology',
        'Psychiatry',
        'Oncology',
        'Gastroenterology',
    ];

    // Load doctors on mount
    useEffect(() => {
        handleGetAllDoctors({
            specialization: filters.specialization,
            minRating: filters.minRating,
            isVerified: filters.isVerified,
            page: currentPage,
            limit: 12,
        });
    }, []);

    // Handle search
    const handleSearch = () => {
        setCurrentPage(1);
        handleGetAllDoctors({
            specialization: filters.specialization,
            minRating: filters.minRating,
            isVerified: filters.isVerified,
            page: 1,
            limit: 12,
        });
    };

    // Handle filter change
    const handleFilterChange = (filterType, value) => {
        handleSetFilters({ [filterType]: value });
    };

    // Handle clear filters
    const handleClearAllFilters = () => {
        handleClearFilters();
        setSearchTerm('');
        setCurrentPage(1);
    };

    // Handle page change
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        handleGetAllDoctors({
            specialization: filters.specialization,
            minRating: filters.minRating,
            isVerified: filters.isVerified,
            page: newPage,
            limit: 12,
        });
    };

    // Handle doctor click
    const handleDoctorClick = (doctor) => {
        setSelectedDoctor(doctor);
        setShowDetailModal(true);
    };

    // Sort doctors
    const sortedDoctors = [...doctors].sort((a, b) => {
        if (sortBy === 'rating') {
            return (b.rating || 0) - (a.rating || 0);
        } else if (sortBy === 'experience') {
            return (b.experience || 0) - (a.experience || 0);
        } else if (sortBy === 'name') {
            return (a.userId?.name || '').localeCompare(b.userId?.name || '');
        }
        return 0;
    });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-primary-600 to-accent-600 text-white py-12 px-4"
            >
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-heading font-bold mb-4">Find a Doctor</h1>
                    <p className="text-primary-100 text-lg">
                        Browse and connect with experienced healthcare professionals
                    </p>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Search and Filter Bar */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8"
                >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        {/* Search Bar */}
                        <div className="relative md:col-span-2">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search doctors by name or specialization..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                            />
                        </div>

                        {/* Specialization Filter */}
                        <select
                            value={filters.specialization || ''}
                            onChange={(e) => {
                                handleFilterChange('specialization', e.target.value || null);
                            }}
                            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                        >
                            <option value="">All Specializations</option>
                            {specializations.map((spec) => (
                                <option key={spec} value={spec}>
                                    {spec}
                                </option>
                            ))}
                        </select>

                        {/* Sort By */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                        >
                            <option value="rating">Sort by Rating</option>
                            <option value="experience">Sort by Experience</option>
                            <option value="name">Sort by Name</option>
                        </select>
                    </div>

                    {/* Advanced Filters Toggle */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold transition-colors"
                    >
                        <Filter className="w-4 h-4" />
                        <span>{showFilters ? 'Hide' : 'Show'} Advanced Filters</span>
                        <ChevronDown
                            className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''
                                }`}
                        />
                    </motion.button>

                    {/* Advanced Filters */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Min Rating Filter */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Minimum Rating
                                        </label>
                                        <select
                                            value={filters.minRating || ''}
                                            onChange={(e) => {
                                                handleFilterChange(
                                                    'minRating',
                                                    e.target.value ? parseFloat(e.target.value) : null
                                                );
                                            }}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                                        >
                                            <option value="">All Ratings</option>
                                            <option value="4">4★ and above</option>
                                            <option value="4.5">4.5★ and above</option>
                                            <option value="5">5★ only</option>
                                        </select>
                                    </div>

                                    {/* Verified Filter */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Verification Status
                                        </label>
                                        <select
                                            value={filters.isVerified === null ? '' : filters.isVerified}
                                            onChange={(e) => {
                                                if (e.target.value === '') {
                                                    handleFilterChange('isVerified', null);
                                                } else {
                                                    handleFilterChange('isVerified', e.target.value === 'true');
                                                }
                                            }}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                                        >
                                            <option value="">All Doctors</option>
                                            <option value="true">Verified Only</option>
                                        </select>
                                    </div>

                                    {/* Clear Filters */}
                                    <div className="flex items-end">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleClearAllFilters}
                                            className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                        >
                                            Clear All Filters
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Results Info */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-between mb-6"
                >
                    <p className="text-gray-600 dark:text-gray-400">
                        Showing <span className="font-semibold text-gray-900 dark:text-white">
                            {sortedDoctors.length}
                        </span> doctors out of <span className="font-semibold text-gray-900 dark:text-white">
                            {pagination.total}
                        </span>
                    </p>
                </motion.div>

                {/* Error Alert */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                    >
                        <p className="text-red-800 dark:text-red-300">{error}</p>
                    </motion.div>
                )}

                {/* Doctor Grid */}
                {isLoading ? (
                    <Loading fullPage={false} message="Loading doctors..." />
                ) : sortedDoctors.length > 0 ? (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
                    >
                        {sortedDoctors.map((doctor) => (
                            <DoctorCard
                                key={doctor._id}
                                doctor={doctor}
                                onViewDetails={() => handleDoctorClick(doctor)}
                            />
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl"
                    >
                        <Award className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" />
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            No Doctors Found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Try adjusting your filters or search terms
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleClearAllFilters}
                            className="mt-6 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors"
                        >
                            Clear All Filters
                        </motion.button>
                    </motion.div>
                )}

                {/* Pagination */}
                {!isLoading && pagination.pages > 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-2 mt-8"
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                        >
                            Previous
                        </motion.button>

                        <div className="flex items-center gap-1">
                            {Array.from(
                                { length: Math.min(5, pagination.pages) },
                                (_, i) => {
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
                                                : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                                }`}
                                        >
                                            {pageNum}
                                        </motion.button>
                                    );
                                }
                            )}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handlePageChange(Math.min(pagination.pages, currentPage + 1))}
                            disabled={currentPage === pagination.pages}
                            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                        >
                            Next
                        </motion.button>

                        <span className="text-sm text-gray-600 dark:text-gray-400 ml-4">
                            Page {currentPage} of {pagination.pages}
                        </span>
                    </motion.div>
                )}
            </div>

            {/* Doctor Detail Modal */}
            <AnimatePresence>
                {showDetailModal && selectedDoctor && (
                    <DoctorDetailModal
                        doctor={selectedDoctor}
                        isOpen={showDetailModal}
                        onClose={() => {
                            setShowDetailModal(false);
                            setSelectedDoctor(null);
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default DoctorListing;
