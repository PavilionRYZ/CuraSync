import React from 'react';
import { motion } from 'framer-motion';
import {
    Calendar,
    Stethoscope,
    Heart,
    Brain,
    Shield,
    Clock,
    Users,
    Award,
    Star,
    ArrowRight,
    CheckCircle,
    MessageCircle,
    Activity,
    Zap,
    Phone,
    Mail,
    MapPin,
    Search,
} from 'lucide-react';

const Homepage = () => {
    // Animation variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 60 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: 'easeOut' },
        },
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const features = [
        {
            icon: Calendar,
            title: 'Easy Appointments',
            description: 'Book appointments with top doctors in just a few clicks',
            color: 'from-blue-500 to-cyan-500',
        },
        {
            icon: Brain,
            title: 'AI-Powered',
            description: 'Get smart doctor recommendations based on your symptoms',
            color: 'from-purple-500 to-pink-500',
        },
        {
            icon: Shield,
            title: 'Secure & Private',
            description: 'Your health data is encrypted and completely secure',
            color: 'from-green-500 to-emerald-500',
        },
        {
            icon: Clock,
            title: '24/7 Support',
            description: 'Round-the-clock medical assistance whenever you need',
            color: 'from-orange-500 to-red-500',
        },
    ];

    const services = [
        {
            icon: Stethoscope,
            title: 'General Consultation',
            description: 'Consult with experienced general physicians for routine checkups',
            image: '🩺',
        },
        {
            icon: Heart,
            title: 'Cardiology',
            description: 'Expert care for all heart-related conditions and concerns',
            image: '❤️',
        },
        {
            icon: Brain,
            title: 'Neurology',
            description: 'Specialized treatment for brain and nervous system disorders',
            image: '🧠',
        },
        {
            icon: Activity,
            title: 'Emergency Care',
            description: 'Immediate medical attention for urgent health situations',
            image: '🚨',
        },
        {
            icon: MessageCircle,
            title: 'Telemedicine',
            description: 'Virtual consultations from the comfort of your home',
            image: '💬',
        },
        {
            icon: Search,
            title: 'Health Checkup',
            description: 'Comprehensive health screening and diagnostic services',
            image: '🔬',
        },
    ];

    const doctors = [
        {
            name: 'Dr. Sarah Johnson',
            specialty: 'Cardiologist',
            experience: '15 years',
            rating: 4.9,
            reviews: 234,
            image: 'https://randomuser.me/api/portraits/women/1.jpg',
        },
        {
            name: 'Dr. Michael Chen',
            specialty: 'Neurologist',
            experience: '12 years',
            rating: 4.8,
            reviews: 189,
            image: 'https://randomuser.me/api/portraits/men/2.jpg',
        },
        {
            name: 'Dr. Emily Rodriguez',
            specialty: 'Pediatrician',
            experience: '10 years',
            rating: 5.0,
            reviews: 312,
            image: 'https://randomuser.me/api/portraits/women/3.jpg',
        },
    ];

    const stats = [
        { icon: Users, value: '50K+', label: 'Happy Patients' },
        { icon: Award, value: '200+', label: 'Expert Doctors' },
        { icon: Star, value: '4.9', label: 'Average Rating' },
        { icon: Clock, value: '24/7', label: 'Support' },
    ];

    const testimonials = [
        {
            name: 'John Smith',
            role: 'Patient',
            content: 'CuraSync made finding the right doctor so easy. The AI recommendations were spot-on!',
            rating: 5,
            image: 'https://randomuser.me/api/portraits/men/5.jpg',
        },
        {
            name: 'Maria Garcia',
            role: 'Patient',
            content: 'Amazing platform! Booked my appointment in minutes and the doctor was excellent.',
            rating: 5,
            image: 'https://randomuser.me/api/portraits/women/6.jpg',
        },
        {
            name: 'David Lee',
            role: 'Patient',
            content: 'The telemedicine feature is a game-changer. Got quality care without leaving home.',
            rating: 5,
            image: 'https://randomuser.me/api/portraits/men/7.jpg',
        },
    ];

    return (
        <div className="overflow-hidden">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-accent-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 90, 0],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                        className="absolute top-20 left-10 w-72 h-72 bg-primary-200 dark:bg-primary-900 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-xl opacity-30"
                    />
                    <motion.div
                        animate={{
                            scale: [1.2, 1, 1.2],
                            rotate: [90, 0, 90],
                        }}
                        transition={{
                            duration: 25,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                        className="absolute bottom-20 right-10 w-96 h-96 bg-accent-200 dark:bg-accent-900 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-xl opacity-30"
                    />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={staggerContainer}
                            className="text-center lg:text-left"
                        >
                            <motion.div variants={fadeInUp} className="inline-block">
                                <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary-100 to-accent-100 dark:from-primary-900 dark:to-accent-900 text-primary-700 dark:text-primary-300 text-sm font-semibold mb-6">
                                    <Zap className="w-4 h-4 mr-2" />
                                    AI-Powered Healthcare Platform
                                </span>
                            </motion.div>

                            <motion.h1
                                variants={fadeInUp}
                                className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-gray-900 dark:text-white mb-6 leading-tight"
                            >
                                Your Health,{' '}
                                <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                                    Our Priority
                                </span>
                            </motion.h1>

                            <motion.p
                                variants={fadeInUp}
                                className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed"
                            >
                                Connect with expert doctors, get AI-powered recommendations, and manage your health seamlessly. Experience healthcare like never before.
                            </motion.p>

                            <motion.div
                                variants={fadeInUp}
                                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                            >
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="btn-primary group"
                                >
                                    Book Appointment
                                    <ArrowRight className="inline ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="btn-secondary"
                                >
                                    Learn More
                                </motion.button>
                            </motion.div>

                            <motion.div
                                variants={fadeInUp}
                                className="mt-12 flex items-center justify-center lg:justify-start space-x-8"
                            >
                                {stats.slice(0, 3).map((stat, index) => (
                                    <div key={index} className="text-center">
                                        <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                            {stat.value}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            {stat.label}
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        </motion.div>

                        {/* Right Content - Floating Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <motion.div
                                animate={{
                                    y: [0, -20, 0],
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                }}
                                className="card relative z-10"
                            >
                                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                                    <Heart className="w-12 h-12 text-white" fill="currentColor" />
                                </div>

                                <h3 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-4">
                                    Quick Appointment
                                </h3>

                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Search symptoms or specialization"
                                        className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                    />
                                    <input
                                        type="date"
                                        className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                    />
                                    <select className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 outline-none transition-all">
                                        <option>Select Time Slot</option>
                                        <option>Morning (9 AM - 12 PM)</option>
                                        <option>Afternoon (12 PM - 5 PM)</option>
                                        <option>Evening (5 PM - 9 PM)</option>
                                    </select>
                                    <button className="w-full btn-primary">
                                        Find Doctors
                                    </button>
                                </div>
                            </motion.div>

                            {/* Floating Elements */}
                            <motion.div
                                animate={{
                                    y: [0, 15, 0],
                                    rotate: [0, 5, 0],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                }}
                                className="absolute top-10 -left-10 card p-4 w-48"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                                        <CheckCircle className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900 dark:text-white">50K+</div>
                                        <div className="text-xs text-gray-600 dark:text-gray-400">
                                            Appointments
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                animate={{
                                    y: [0, -15, 0],
                                    rotate: [0, -5, 0],
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                    delay: 1,
                                }}
                                className="absolute bottom-10 -right-10 card p-4 w-48"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                                        <Star className="w-6 h-6 text-white" fill="currentColor" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900 dark:text-white">4.9/5</div>
                                        <div className="text-xs text-gray-600 dark:text-gray-400">
                                            Rating
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 dark:text-white mb-4">
                            Why Choose{' '}
                            <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                                CuraSync
                            </span>
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Experience the future of healthcare with our innovative features
                        </p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                whileHover={{ y: -10 }}
                                className="card group cursor-pointer"
                            >
                                <div
                                    className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                                >
                                    <feature.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="py-20 bg-gray-50 dark:bg-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 dark:text-white mb-4">
                            Our Services
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Comprehensive healthcare services tailored to your needs
                        </p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {services.map((service, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                whileHover={{ scale: 1.05 }}
                                className="card group cursor-pointer"
                            >
                                <div className="text-5xl mb-4">{service.image}</div>
                                <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                    {service.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    {service.description}
                                </p>
                                <a
                                    href="#"
                                    className="text-primary-600 dark:text-primary-400 font-semibold inline-flex items-center group-hover:gap-2 transition-all"
                                >
                                    Learn More
                                    <ArrowRight className="w-4 h-4 ml-1 group-hover:ml-2 transition-all" />
                                </a>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Doctors Section */}
            <section id="doctors" className="py-20 bg-white dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 dark:text-white mb-4">
                            Meet Our Expert Doctors
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Experienced professionals dedicated to your health and wellbeing
                        </p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="grid md:grid-cols-3 gap-8"
                    >
                        {doctors.map((doctor, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                whileHover={{ y: -10 }}
                                className="card group cursor-pointer"
                            >
                                <div className="relative mb-4">
                                    <img
                                        src={doctor.image}
                                        alt={doctor.name}
                                        className="w-full h-64 object-cover rounded-lg"
                                    />
                                    <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-full px-3 py-1 flex items-center space-x-1">
                                        <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
                                        <span className="font-semibold text-sm">
                                            {doctor.rating}
                                        </span>
                                    </div>
                                </div>
                                <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-1">
                                    {doctor.name}
                                </h3>
                                <p className="text-primary-600 dark:text-primary-400 font-semibold mb-2">
                                    {doctor.specialty}
                                </p>
                                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                                    <span>{doctor.experience} experience</span>
                                    <span>{doctor.reviews} reviews</span>
                                </div>
                                <button className="w-full px-4 py-2 bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-lg font-semibold group-hover:bg-gradient-to-r group-hover:from-primary-600 group-hover:to-accent-600 group-hover:text-white transition-all">
                                    Book Appointment
                                </button>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-800 dark:to-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 dark:text-white mb-4">
                            What Our Patients Say
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Real stories from people who trusted us with their health
                        </p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="grid md:grid-cols-3 gap-8"
                    >
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                whileHover={{ scale: 1.05 }}
                                className="card"
                            >
                                <div className="flex mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className="w-5 h-5 text-yellow-500"
                                            fill="currentColor"
                                        />
                                    ))}
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 mb-6 italic">
                                    "{testimonial.content}"
                                </p>
                                <div className="flex items-center">
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        className="w-12 h-12 rounded-full mr-3"
                                    />
                                    <div>
                                        <div className="font-bold text-gray-900 dark:text-white">
                                            {testimonial.name}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            {testimonial.role}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-primary-600 to-accent-600">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                    >
                        <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
                            Ready to Take Control of Your Health?
                        </h2>
                        <p className="text-xl text-white/90 mb-8">
                            Join thousands of satisfied patients who trust CuraSync for their healthcare needs
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg shadow-xl hover:shadow-2xl transition-all"
                            >
                                Get Started Now
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-600 transition-all"
                            >
                                Contact Us
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Homepage;
