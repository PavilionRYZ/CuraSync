import { motion } from 'framer-motion';
import {
    Star,
    CheckCircle,
    MapPin,
    Users,
    Award,
    ArrowRight,
} from 'lucide-react';

const DoctorCard = ({ doctor, onViewDetails }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer"
            onClick={onViewDetails}
        >
            {/* Header with Image and Verification */}
            <div className="relative h-48 bg-gradient-to-br from-primary-400 to-accent-400 overflow-hidden">
                <img
                    src={doctor.profileImage?.url || '/placeholder.jpg'}
                    alt={doctor.userId?.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300?text=Doctor';
                    }}
                />
                {doctor.isVerified && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white p-2 rounded-full shadow-lg">
                        <CheckCircle className="w-5 h-5" />
                    </div>
                )}
                {doctor.rating && (
                    <div className="absolute top-3 left-3 bg-yellow-500 text-white px-3 py-1 rounded-full font-semibold flex items-center gap-1 shadow-lg">
                        <Star className="w-4 h-4" />
                        {doctor.rating.toFixed(1)}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col h-full">
                {/* Name and Specialization */}
                <div className="mb-3">
                    <h3 className="text-lg font-heading font-bold text-gray-900 dark:text-white">
                        {doctor.userId?.name}
                    </h3>
                    <p className="text-primary-600 dark:text-primary-400 font-semibold capitalize text-sm">
                        {doctor.specialization?.[0]}
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-3 text-center text-xs">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg py-2">
                        <p className="font-bold text-blue-600 dark:text-blue-400">
                            {doctor.experience}+
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">Years</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg py-2">
                        <p className="font-bold text-green-600 dark:text-green-400">
                            {doctor.totalReviews || 0}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">Reviews</p>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg py-2">
                        <p className="font-bold text-purple-600 dark:text-purple-400">
                            ₹{doctor.consultationFee}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">Fee</p>
                    </div>
                </div>

                {/* Bio */}
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                    {doctor.bio || 'Experienced healthcare professional'}
                </p>

                {/* Additional Info */}
                <div className="space-y-2 mb-4 text-xs text-gray-600 dark:text-gray-400">
                    {doctor.specialization && doctor.specialization.length > 1 && (
                        <div className="flex items-center gap-2">
                            <Award className="w-3 h-3" />
                            <span>{doctor.specialization.length} specializations</span>
                        </div>
                    )}
                    {doctor.languages && doctor.languages.length > 0 && (
                        <div className="flex items-center gap-2">
                            <Users className="w-3 h-3" />
                            <span>{doctor.languages.join(', ')}</span>
                        </div>
                    )}
                </div>

                {/* Button */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                        e.stopPropagation();
                        onViewDetails();
                    }}
                    className="w-full mt-auto px-4 py-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                    View Details
                    <ArrowRight className="w-4 h-4" />
                </motion.button>
            </div>
        </motion.div>
    );
};

export default DoctorCard;
