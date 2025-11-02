import React from 'react';
import { Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Pages
import Homepage from '../components/pages/Homepage';
import Login from '../components/pages/Login';
import Signup from '../components/pages/Signup';
import VerifyOtp from '../components/pages/verifyOtp';
import ForgotPassword from '../components/pages/ForgotPassword';
import ResetPassword from '../components/pages/ResetPassword';
import NotFound from '../components/pages/NotFound';
import Unauthorized from '../components/pages/Unauthorized';
import ErrorPage from '../components/pages/Error'
import Loading from '../components/pages/Loading'
import AdminDashboard from '../components/pages/admin/AdminDashboard'
import DoctorListing from '../components/pages/DoctorListing';
// Protected Route
import ProtectedRoute from '../components/lib/ProtectedRoute';
import ErrorBoundary from '../components/ErrorBoundary';

const RoutesComponent = () => {
    const { isAuthenticated } = useSelector((state) => state.auth);

    return (
        <ErrorBoundary>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Homepage />} />
                <Route
                    path="/login"
                    element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
                />
                <Route
                    path="/signup"
                    element={isAuthenticated ? <Navigate to="/dashboard" /> : <Signup />}
                />
                <Route path="/verify-otp" element={<VerifyOtp />} />
                <Route
                    path="/forgot-password"
                    element={isAuthenticated ? <Navigate to="/dashboard" /> : <ForgotPassword />}
                />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/doctors" element={<DoctorListing />} />

                {/* Protected Routes */}
                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute requiredRole="admin">
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />


                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="/error" element={<ErrorPage statusCode={500} />} />
                <Route path="/404" element={<NotFound />} />
                <Route path="/loading" element={<Loading />} />

                {/* 404 - Must be last */}
                <Route path="*" element={<NotFound />} />

            </Routes>
        </ErrorBoundary>
    );
};

export default RoutesComponent;
