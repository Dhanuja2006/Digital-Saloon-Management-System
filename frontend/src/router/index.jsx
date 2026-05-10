import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Salons from '../pages/Salons';
import SalonDetails from '../pages/SalonDetails';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import VerifyEmail from '../pages/VerifyEmail';
import DashboardLayout from '../layouts/DashboardLayout';
import Dashboard from '../pages/Dashboard';
import AdminUsers from '../pages/AdminUsers';
import AdminBookings from '../pages/AdminBookings';
import AdminReviews from '../pages/AdminReviews';
import OwnerBookings from '../pages/OwnerBookings';
import OwnerServices from '../pages/OwnerServices';
import OwnerSlots from '../pages/OwnerSlots';
import OwnerAddSalon from '../pages/OwnerAddSalon';
import OwnerSalonProfile from '../pages/OwnerSalonProfile';
import OwnerAnalytics from '../pages/OwnerAnalytics';
import CustomerProfile from '../pages/CustomerProfile';
import { AuthContext } from '../context/AuthContext';

const DashboardRoleRouter = ({ admin: AdminView, owner: OwnerView, customer: CustomerView }) => {
  const { user } = React.useContext(AuthContext);
  if (!user) return null;
  if (user.role === 'Admin' && AdminView) return <AdminView />;
  if (user.role === 'Salon Owner' && OwnerView) return <OwnerView />;
  if (user.role === 'Customer' && CustomerView) return <CustomerView />;
  return <div className="glass-card text-center mt-4">Module not found or unauthorized.</div>;
};

const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/salons" element={<Salons />} />
      <Route path="/salons/:id" element={<SalonDetails />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* Protected Dashboard Routes */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />

        {/* Admin Routes */}
        <Route path="users" element={<DashboardRoleRouter admin={AdminUsers} />} />
        <Route path="all-bookings" element={<DashboardRoleRouter admin={AdminBookings} />} />
        {/* <Route path="all-reviews" element={<DashboardRoleRouter admin={AdminReviews} />} /> */}

        {/* Owner Routes */}
        <Route path="bookings" element={<DashboardRoleRouter owner={OwnerBookings} />} />
        <Route path="slots" element={<DashboardRoleRouter owner={OwnerSlots} />} />
        <Route path="services" element={<DashboardRoleRouter owner={OwnerServices} />} />
        <Route path="add-salon" element={<DashboardRoleRouter owner={OwnerAddSalon} />} />
        <Route path="salon-profile" element={<DashboardRoleRouter owner={OwnerSalonProfile} />} />
        <Route path="analytics" element={<DashboardRoleRouter owner={OwnerAnalytics} />} />

        {/* Customer Routes */}
        <Route path="profile" element={<DashboardRoleRouter customer={CustomerProfile} />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<div className="container mt-4 text-center"><h2>404 - Page Not Found</h2></div>} />
    </Routes>
  );
};

export default AppRouter;
