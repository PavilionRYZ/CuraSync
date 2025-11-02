import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Menu,
    X,
    Sun,
    Moon,
    Heart,
    LogOut,
    User,
    LayoutDashboard,
    ChevronDown,
    Settings,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { logout } from '../../redux/slices/authSlice';

const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { theme, toggleTheme } = useTheme();

    // Redux
    const { isAuthenticated, user, isLoading } = useSelector(
        (state) => state.auth
    );

    // Local states
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close profile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.profile-menu')) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/services' },
        { name: 'Doctors', path: '/doctors' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    const handleLogout = async () => {
        await dispatch(logout());
        setIsProfileOpen(false);
        setIsOpen(false);
        navigate('/');
    };

    const handleNavClick = (href) => {
        setIsOpen(false);
        if (href.startsWith('#')) {
            const element = document.querySelector(href);
            element?.scrollIntoView({ behavior: 'smooth' });
        } else {
            navigate(href);
        }
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`fixed w-full z-50 transition-all duration-300 ${scrolled
                ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg'
                : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        onClick={() => navigate('/')}
                        className="flex items-center space-x-2 cursor-pointer"
                    >
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
                            <Heart className="w-6 h-6 text-white" fill="currentColor" />
                        </div>
                        <span className="text-2xl font-heading font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                            CuraSync
                        </span>
                    </motion.div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navItems.map((item, index) => (
                            <motion.div
                                key={item.name}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link
                                    to={item.path}
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors duration-200 relative group"
                                >
                                    {item.name}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-600 to-accent-600 group-hover:w-full transition-all duration-300"></span>
                                </Link>
                            </motion.div>

                        ))}
                    </div>

                    {/* Right Side Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        {/* Theme Toggle */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleTheme}
                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            aria-label="Toggle theme"
                        >
                            {theme === 'light' ? (
                                <Moon className="w-5 h-5" />
                            ) : (
                                <Sun className="w-5 h-5" />
                            )}
                        </motion.button>

                        {/* User is NOT logged in */}
                        {!isAuthenticated ? (
                            <>
                                {/* Login Button */}
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => navigate('/login')}
                                    className="px-6 py-2 text-primary-600 dark:text-primary-400 font-semibold hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                                >
                                    Login
                                </motion.button>

                                {/* Sign Up Button */}
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => navigate('/signup')}
                                    className="btn-primary"
                                >
                                    Sign Up
                                </motion.button>
                            </>
                        ) : (
                            /* User IS logged in */
                            <div className="profile-menu relative">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center space-x-3 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-sm font-semibold">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-gray-700 dark:text-gray-300 font-medium hidden sm:inline">
                                        {user?.name?.split(' ')}
                                    </span>
                                    <ChevronDown
                                        className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''
                                            }`}
                                    />
                                </motion.button>

                                {/* Profile Dropdown */}
                                <AnimatePresence>
                                    {isProfileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                                        >
                                            {/* User Info Section */}
                                            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                    {user?.name}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                    {user?.email}
                                                </p>
                                                {user?.role && (
                                                    <p className="text-xs text-primary-600 dark:text-primary-400 mt-1 uppercase font-semibold">
                                                        {user?.role}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Menu Items */}
                                            <div className="py-2">
                                                {/* Dashboard Option */}
                                                <motion.button
                                                    whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                                                    onClick={() => {
                                                        navigate('/admin/dashboard');
                                                        setIsProfileOpen(false);
                                                    }}
                                                    className="w-full px-4 py-2 flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                                                >
                                                    <LayoutDashboard className="w-4 h-4" />
                                                    <span>Dashboard</span>
                                                </motion.button>

                                                {/* Profile Settings */}
                                                <motion.button
                                                    whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                                                    onClick={() => {
                                                        navigate('/profile');
                                                        setIsProfileOpen(false);
                                                    }}
                                                    className="w-full px-4 py-2 flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                                                >
                                                    <User className="w-4 h-4" />
                                                    <span>Profile</span>
                                                </motion.button>

                                                {/* Settings */}
                                                <motion.button
                                                    whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                                                    onClick={() => {
                                                        navigate('/settings');
                                                        setIsProfileOpen(false);
                                                    }}
                                                    className="w-full px-4 py-2 flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                                                >
                                                    <Settings className="w-4 h-4" />
                                                    <span>Settings</span>
                                                </motion.button>
                                            </div>

                                            {/* Logout Button */}
                                            <div className="border-t border-gray-200 dark:border-gray-700 py-2">
                                                <motion.button
                                                    whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                                                    disabled={isLoading}
                                                    onClick={handleLogout}
                                                    className="w-full px-4 py-2 flex items-center space-x-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isLoading ? (
                                                        <div className="w-4 h-4 border-2 border-red-600 dark:border-red-400 border-t-transparent rounded-full animate-spin" />
                                                    ) : (
                                                        <LogOut className="w-4 h-4" />
                                                    )}
                                                    <span>{isLoading ? 'Logging out...' : 'Logout'}</span>
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center space-x-2">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleTheme}
                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
                        >
                            {theme === 'light' ? (
                                <Moon className="w-5 h-5" />
                            ) : (
                                <Sun className="w-5 h-5" />
                            )}
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
                        >
                            {isOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800"
                    >
                        <div className="px-4 py-6 space-y-4">
                            {/* Navigation Links */}
                            {navItems.map((item, index) => (
                                <motion.a
                                    key={item.name}
                                    href={item.href}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    onClick={(e) => {
                                        if (item.href.startsWith('#')) {
                                            e.preventDefault();
                                            handleNavClick(item.href);
                                        } else {
                                            setIsOpen(false);
                                        }
                                    }}
                                    className="block text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium py-2 transition-colors"
                                >
                                    {item.name}
                                </motion.a>
                            ))}

                            {/* Divider */}
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4" />

                            {/* User is NOT logged in */}
                            {!isAuthenticated ? (
                                <>
                                    <motion.button
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 }}
                                        onClick={() => {
                                            navigate('/login');
                                            setIsOpen(false);
                                        }}
                                        className="w-full px-4 py-2 text-primary-600 dark:text-primary-400 font-semibold border-2 border-primary-600 dark:border-primary-500 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-800 transition-colors text-center"
                                    >
                                        Login
                                    </motion.button>
                                    <motion.button
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.6 }}
                                        onClick={() => {
                                            navigate('/signup');
                                            setIsOpen(false);
                                        }}
                                        className="w-full btn-primary"
                                    >
                                        Sign Up
                                    </motion.button>
                                </>
                            ) : (
                                /* User IS logged in - Mobile Profile Menu */
                                <>
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3"
                                    >
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                            {user?.name}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                            {user?.email}
                                        </p>
                                        {user?.role && (
                                            <p className="text-xs text-primary-600 dark:text-primary-400 mt-1 uppercase font-semibold">
                                                {user?.role}
                                            </p>
                                        )}
                                    </motion.div>

                                    <motion.button
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.55 }}
                                        onClick={() => {
                                            navigate('/dashboard');
                                            setIsOpen(false);
                                        }}
                                        className="w-full px-4 py-2 flex items-center justify-center space-x-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors font-semibold"
                                    >
                                        <LayoutDashboard className="w-4 h-4" />
                                        <span>Dashboard</span>
                                    </motion.button>

                                    <motion.button
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.6 }}
                                        onClick={() => {
                                            navigate('/profile');
                                            setIsOpen(false);
                                        }}
                                        className="w-full px-4 py-2 flex items-center justify-center space-x-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-semibold"
                                    >
                                        <User className="w-4 h-4" />
                                        <span>Profile</span>
                                    </motion.button>

                                    <motion.button
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.65 }}
                                        disabled={isLoading}
                                        onClick={handleLogout}
                                        className="w-full px-4 py-2 flex items-center justify-center space-x-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <div className="w-4 h-4 border-2 border-red-600 dark:border-red-400 border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <LogOut className="w-4 h-4" />
                                        )}
                                        <span>{isLoading ? 'Logging out...' : 'Logout'}</span>
                                    </motion.button>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
