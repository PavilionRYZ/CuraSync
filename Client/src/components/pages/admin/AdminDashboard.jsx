import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart3,
    Users,
    Stethoscope,
    Calendar,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronRight,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../redux/slices/authSlice';
import DoctorManagement from './DoctorManagement';
import DashboardOverview from './DashboardOverview';
import ClinicManagement from './ClinicManagement';
import AppointmentManagement from './AppointmentManagement';
import AdminSettings from './Settings';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const [activeTab, setActiveTab] = useState('overview');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    // Check if user is admin
    useEffect(() => {
        if (user?.role !== 'admin') {
            navigate('/unauthorized');
        }
    }, [user, navigate]);

    const handleLogout = async () => {
        await dispatch(logout());
        navigate('/');
    };

    const menuItems = [
        {
            id: 'overview',
            name: 'Dashboard',
            icon: BarChart3,
            label: 'Analytics & Overview',
            badge: null,
        },
        {
            id: 'doctors',
            name: 'Doctors',
            icon: Stethoscope,
            label: 'Manage Doctors',
            badge: 'Manage',
        },
        {
            id: 'clinics',
            name: 'Clinics',
            icon: Users,
            label: 'Manage Clinics',
            badge: 'Manage',
        },
        {
            id: 'appointments',
            name: 'Appointments',
            icon: Calendar,
            label: 'Manage Appointments',
            badge: 'Soon',
        },
        {
            id: 'settings',
            name: 'Settings',
            icon: Settings,
            label: 'System Settings',
            badge: null,
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
        },
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            {/* Sidebar */}
            <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.3 }}
                className={`mt-16 fixed top-0 left-0 h-screen overflow-y-auto z-30
                    ${sidebarOpen ? 'w-72' : 'w-20'}
                    bg-gradient-to-br from-gray-900 to-gray-800
                     dark:from-gray-950 dark:to-gray-900 text-white
                    transition-all duration-300 shadow-2xl`}
            >
                {/* Logo */}
                <div className="p-6 border-b border-gray-700 flex items-center justify-between">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center space-x-3"
                    >
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
                            <Stethoscope className="w-6 h-6 text-white" />
                        </div>
                        {sidebarOpen && (
                            <span className="text-xl font-heading font-bold">CuraSync</span>
                        )}
                    </motion.div>
                    {sidebarOpen && (
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setSidebarOpen(false)}
                            className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </motion.button>
                    )}
                </div>

                {/* User Info */}
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="p-4 border-b border-gray-700 bg-gray-800/50"
                    >
                        <p className="text-sm text-gray-300 mb-1">Logged in as</p>
                        <p className="font-semibold text-white">{user?.name}</p>
                        <p className="text-xs text-primary-400 uppercase font-bold">
                            {user?.role}
                        </p>
                    </motion.div>
                )}

                {/* Menu Items */}
                <nav className="p-4 space-y-2">
                    {menuItems.map((item, index) => (
                        <motion.button
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => {
                                if (item.badge !== 'Soon') {
                                    setActiveTab(item.id);
                                }
                            }}
                            disabled={item.badge === 'Soon'}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === item.id
                                ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg'
                                : 'text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed'
                                }`}
                        >
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                            {sidebarOpen && (
                                <>
                                    <div className="flex-1 text-left">
                                        <p className="font-semibold">{item.name}</p>
                                        <p className="text-xs opacity-75">{item.label}</p>
                                    </div>
                                    {item.badge && (
                                        <span className={`text-xs font-bold px-2 py-1 rounded ${item.badge === 'Soon'
                                            ? 'bg-yellow-500/20 text-yellow-300'
                                            : 'bg-green-500/20 text-green-300'
                                            }`}>
                                            {item.badge}
                                        </span>
                                    )}
                                    <ChevronRight
                                        className={`w-4 h-4 transition-transform ${activeTab === item.id ? 'rotate-90' : ''
                                            }`}
                                    />
                                </>
                            )}
                        </motion.button>
                    ))}
                </nav>

                {/* Logout Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700 bg-gradient-to-t from-gray-900 to-transparent"
                >
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        {sidebarOpen && <span>Logout</span>}
                    </motion.button>
                </motion.div>
            </motion.div>

            {/* Main Content */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-20'}`}>
                <div className="mt-16">
                    {/* Top Bar */}
                    <motion.div
                        initial={{ y: -100 }}
                        animate={{ y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-30"
                    >
                        <div className="flex items-center justify-between px-6 py-4">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                            </motion.button>

                            <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
                                {menuItems.find((m) => m.id === activeTab)?.name || 'Dashboard'}
                            </h1>

                            <div className="flex items-center space-x-4">
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {user?.name}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {user?.email}
                                    </p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center text-white font-bold">
                                    {user?.name?.charAt(0)}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Content Area */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex-1 overflow-auto p-6"
                    >
                        <AnimatePresence mode="wait">
                            {activeTab === 'overview' && <DashboardOverview />}
                            {activeTab === 'doctors' && <DoctorManagement />}
                            {activeTab === 'clinics' && <ClinicManagement />}
                            {activeTab === 'appointments' && <AppointmentManagement />}
                            {activeTab === 'settings' && <AdminSettings />}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
