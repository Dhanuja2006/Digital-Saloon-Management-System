import React from 'react';

export const PlaceholderPage = ({ title, description }) => (
  <div className="glass-card text-center" style={{ marginTop: '2rem' }}>
    <h2 className="mb-2">{title}</h2>
    <p style={{ color: 'var(--text-secondary)' }}>{description}</p>
    <div style={{ padding: '2rem', border: '1px dashed var(--border-color)', borderRadius: '8px', marginTop: '1rem' }}>
      Module interface under construction...
    </div>
  </div>
);

// Admin Pages
export const AdminAnalytics = () => <PlaceholderPage title="Analytics & Reports" description="Daily / weekly / monthly bookings graph. Revenue trends. Most popular services. Top-performing salons." />
export const AdminUsers = () => <PlaceholderPage title="User Management" description="List of customers & salon owners. Block / suspend users. View user activity. Reset accounts." />
export const AdminBookings = () => <PlaceholderPage title="Booking Monitoring" description="All bookings in system. Filters by Date, Salon, Status. Detect anomalies." />
export const AdminPayments = () => <PlaceholderPage title="Payment & Revenue Panel" description="All transactions. Platform commission earned. Refund requests. Payment status." />
export const AdminReviews = () => <PlaceholderPage title="Review Moderation" description="List of reviews. Flagged reviews. Remove inappropriate content." />
export const AdminComplaints = () => <PlaceholderPage title="Complaint / Support Panel" description="Customer complaints. Salon complaints. Resolution tracking." />
export const AdminSettings = () => <PlaceholderPage title="System Controls" description="Commission percentage settings. Platform configurations. Notification settings." />

// Owner Pages
export const OwnerBookings = () => <PlaceholderPage title="Booking Management" description="Upcoming bookings. Ongoing appointments. Completed bookings. Mark as completed. Cancel (if needed). View customer details." />
export const OwnerSlots = () => <PlaceholderPage title="Slot Management (CORE SECTION)" description="View all time slots. Slot occupancy. Create/edit slots. Block/unblock slots." />
export const OwnerServices = () => <PlaceholderPage title="Service Management" description="Add new service. Edit service details. Activate/deactivate services." />
export const OwnerProfile = () => <PlaceholderPage title="Salon Profile" description="Edit salon details. Upload images/portfolio. Update working hours." />
export const OwnerEarnings = () => <PlaceholderPage title="Earnings & Payments" description="Total earnings. Completed payments. Commission deducted. Transaction history." />
export const OwnerReviews = () => <PlaceholderPage title="Reviews & Feedback" description="Customer reviews. Ratings summary. Respond to reviews." />
export const OwnerAnalytics = () => <PlaceholderPage title="Analytics" description="Most booked services. Peak hours. Customer trends." />
export const OwnerNotifications = () => <PlaceholderPage title="Notifications" description="New bookings. Cancellations. Payment alerts." />

// Customer Pages
export const CustomerPayments = () => <PlaceholderPage title="Payments" description="Payment history. Transaction details. Refund status." />
export const CustomerReviews = () => <PlaceholderPage title="Reviews & Ratings" description="Reviews given by user. Option to edit/delete review." />
export const CustomerFavorites = () => <PlaceholderPage title="Favorites / Saved Salons" description="Bookmarked salons. Quick access." />
export const CustomerNotifications = () => <PlaceholderPage title="Notifications" description="Booking confirmation. Payment success/failure. Reminders." />
export const CustomerProfile = () => <PlaceholderPage title="Profile Management" description="Personal details. Saved preferences. Password change." />
export const CustomerSmartFeatures = () => <PlaceholderPage title="Smart Features Section" description="AI hairstyle recommendations, personalized style matching, and virtual try-on history." />
