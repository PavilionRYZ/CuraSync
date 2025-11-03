import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Link2,
  Unlink,
  Filter,
  AlertCircle,
  X,
  CheckCircle,
} from 'lucide-react';
import { useDoctor } from '../../hooks/useDoctor';
import { useClinic } from '../../hooks/useClinic';
import AffiliationForm from './AffiliationForm';
import AffiliationList from './AffiliationList';
import Loading from '../Loading';

const AffiliationManagement = () => {
  const {
    doctors,
    affiliations,
    affiliationLoading,
    error: doctorError,
    handleGetAllDoctors,
    handleClearError: handleClearDoctorError,
  } = useDoctor();

  const {
    clinics,
    isLoading: clinicLoading,
    error: clinicError,
    handleGetAllClinics,
    handleClearError: handleClearClinicError,
  } = useClinic();

  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClinic, setFilterClinic] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [editAffiliation, setEditAffiliation] = useState(null);

  useEffect(() => {
    handleGetAllDoctors({ limit: 100 });
    handleGetAllClinics({ limit: 100 });
  }, []);

  const filteredAffiliations = affiliations.filter((aff) => {
    const matchesSearch =
      aff.doctorId?.userId?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      aff.clinicId?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesClinic = !filterClinic || aff.clinicId?._id === filterClinic;
    const matchesStatus = !filterStatus || aff.status === filterStatus;

    return matchesSearch && matchesClinic && matchesStatus;
  });

  const handleOpenForm = (affiliation = null) => {
    setEditAffiliation(affiliation);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditAffiliation(null);
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
      className="space-y-6 pb-20 md:pb-28"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
            Doctor-Clinic Affiliations
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage doctor assignments to clinics
          </p>
        </div>

        


        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleOpenForm()}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Create Affiliation</span>
        </motion.button>
      </motion.div>

      {/* Error Alerts */}
      {(doctorError || clinicError) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          {doctorError && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <p className="text-red-800 dark:text-red-300">{doctorError}</p>
              </div>
              <button
                onClick={handleClearDoctorError}
                className="text-red-600 dark:text-red-400 hover:text-red-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
          {clinicError && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <p className="text-red-800 dark:text-red-300">{clinicError}</p>
              </div>
              <button
                onClick={handleClearClinicError}
                className="text-red-600 dark:text-red-400 hover:text-red-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
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
              placeholder="Search by doctor or clinic name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
            />
          </div>

          {/* Clinic Filter */}
          <select
            value={filterClinic}
            onChange={(e) => setFilterClinic(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
          >
            <option value="">All Clinics</option>
            {clinics.map((clinic) => (
              <option key={clinic._id} value={clinic._id}>
                {clinic.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Results Info */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Total: {filteredAffiliations.length} affiliations</span>
        </div>
      </motion.div>

        {/* Stats */}
      {!affiliationLoading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 dark:text-blue-400 text-sm font-semibold">
                  Total Affiliations
                </p>
                <p className="text-3xl font-bold text-blue-700 dark:text-blue-300 mt-2">
                  {affiliations.length}
                </p>
              </div>
              <Link2 className="w-12 h-12 text-blue-300 dark:text-blue-600" />
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 dark:text-green-400 text-sm font-semibold">
                  Active Affiliations
                </p>
                <p className="text-3xl font-bold text-green-700 dark:text-green-300 mt-2">
                  {affiliations.filter((a) => a.status === 'active').length}
                </p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-300 dark:text-green-600" />
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 dark:text-purple-400 text-sm font-semibold">
                  Doctors Affiliated
                </p>
                <p className="text-3xl font-bold text-purple-700 dark:text-purple-300 mt-2">
                  {new Set(affiliations.map((a) => a.doctorId?._id)).size}
                </p>
              </div>
              <Filter className="w-12 h-12 text-purple-300 dark:text-purple-600" />
            </div>
          </div>
        </motion.div>
      )}

      {/* Affiliation List */}
      {affiliationLoading ? (
        <Loading fullPage={false} message="Loading affiliations..." />
      ) : (
        <AffiliationList
          affiliations={filteredAffiliations}
          doctors={doctors}
          clinics={clinics}
          onEdit={handleOpenForm}
          onRefresh={() => {
            handleGetAllDoctors({ limit: 100 });
            handleGetAllClinics({ limit: 100 });
          }}
        />
      )}

      {/* Affiliation Form Modal */}
      <AnimatePresence>
        {showForm && (
          <AffiliationForm
            isOpen={showForm}
            onClose={handleCloseForm}
            onSuccess={() => {
              handleCloseForm();
              handleGetAllDoctors({ limit: 100 });
              handleGetAllClinics({ limit: 100 });
            }}
            editAffiliation={editAffiliation}
            doctors={doctors}
            clinics={clinics}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AffiliationManagement;
