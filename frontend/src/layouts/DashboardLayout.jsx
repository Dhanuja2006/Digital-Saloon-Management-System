import React, { useContext, useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  LayoutDashboard, Users, Scissors, Calendar, 
  CreditCard, MessageSquare, AlertTriangle, Settings, 
  BarChart, Heart, Bell, User, Clock, Menu, ChevronLeft
} from 'lucide-react';

const DashboardLayout = () => {
  const { user } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (!user) {
    return <div className="container mt-4 text-center">Please log in to view the dashboard.</div>;
  }

  const getAdminLinks = () => [
    { to: "/dashboard", label: "Overview", icon: <LayoutDashboard size={20} /> },
    { to: "/dashboard/users", label: "User Management", icon: <Users size={20} /> },
    { to: "/dashboard/all-bookings", label: "Global Bookings", icon: <Calendar size={20} /> },
    // { to: "/dashboard/all-reviews", label: "Review Moderation", icon: <MessageSquare size={20} /> },
  ];

  const getOwnerLinks = () => [
    { to: "/dashboard", label: "Overview", icon: <LayoutDashboard size={20} /> },
    { to: "/dashboard/bookings", label: "Booking Management", icon: <Calendar size={20} /> },
    { to: "/dashboard/slots", label: "Slot Management", icon: <Clock size={20} /> },
    { to: "/dashboard/services", label: "Service Management", icon: <Scissors size={20} /> },
    { to: "/dashboard/salon-profile", label: "Salon Profile", icon: <Settings size={20} /> },
    { to: "/dashboard/analytics", label: "Analytics", icon: <BarChart size={20} /> },
  ];

  const getCustomerLinks = () => [
    { to: "/dashboard", label: "Home / Bookings", icon: <LayoutDashboard size={20} /> },
    { to: "/dashboard/profile", label: "Profile Management", icon: <User size={20} /> },
  ];

  let links = [];
  if (user.role === 'Admin') links = getAdminLinks();
  else if (user.role === 'Salon Owner') links = getOwnerLinks();
  else links = getCustomerLinks();

  return (
    <div className="dashboard-layout">
      <div className={`sidebar ${isSidebarOpen ? '' : 'collapsed'}`}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: isSidebarOpen ? 'space-between' : 'center', 
          padding: isSidebarOpen ? '0 0.5rem 1rem' : '0 0 1rem', 
          borderBottom: '1px solid var(--border-color)', 
          marginBottom: '1rem' 
        }}>
          {isSidebarOpen && (
            <div style={{ overflow: 'hidden' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.2rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user.fullName}</h3>
              <p style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 'bold', textTransform: 'uppercase' }}>
                {user.role} PANEL
              </p>
            </div>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="btn-secondary" 
            style={{ padding: '0.5rem', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.05)', flexShrink: 0 }}
          >
            {isSidebarOpen ? <ChevronLeft size={18} /> : <Menu size={20} />}
          </button>
        </div>
        {links.map((link, idx) => (
          <NavLink 
            key={idx} 
            to={link.to} 
            end={link.to === '/dashboard'}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            title={!isSidebarOpen ? link.label : ""}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{link.icon}</div>
            {isSidebarOpen && <span>{link.label}</span>}
          </NavLink>
        ))}
      </div>
      <div className="dashboard-content" style={{ 
        padding: isSidebarOpen ? '2.5rem 3rem' : '2.5rem 5rem', 
        transition: 'padding 0.3s ease' 
      }}>
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
