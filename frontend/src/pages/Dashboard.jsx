import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { bookingController } from '../controllers/bookingController';
import { salonController } from '../controllers/salonController';
import { Calendar, Clock, MapPin, Check, X } from 'lucide-react';
import api from '../controllers/api';

const CustomerDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingController.getMyBookings();
      setBookings(data.data || []);
    } catch (error) {
      console.error('Failed to fetch bookings', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const [activeReview, setActiveReview] = useState(null); // { salonId, bookingId }
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    
    setSubmitting(true);
    try {
      await api.post('/reviews', { ...activeReview, ...reviewData });
      alert("Review submitted! Thank you.");
      setActiveReview(null);
      setReviewData({ rating: 5, comment: '' });
      fetchBookings();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to submit review";
      alert(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking? (Cancellation is only allowed up to 7 hours before the appointment)")) return;
    
    try {
      await bookingController.cancelBooking(bookingId);
      alert("Booking cancelled successfully");
      fetchBookings();
    } catch (error) {
      alert(error.message || "Failed to cancel booking");
    }
  };

  return (
    <div>
      <h3 className="mb-2">Your Bookings</h3>
      {activeReview && (
        <div className="glass-card mb-4">
          <h4 className="mb-3">Rate your experience</h4>
          <form onSubmit={handleReviewSubmit} className="flex flex-col gap-3">
            <div className="flex gap-2 items-center">
              <label>Rating:</label>
              <select className="glass-input" value={reviewData.rating} onChange={e => setReviewData({...reviewData, rating: Number(e.target.value)})}>
                {[5,4,3,2,1].map(n => <option key={n} value={n} style={{color: 'black'}}>{n} Stars</option>)}
              </select>
            </div>
            <textarea 
              className="glass-input w-full" 
              placeholder="What did you think? (optional)" 
              value={reviewData.comment} 
              onChange={e => setReviewData({...reviewData, comment: e.target.value})}
            />
            <div className="flex gap-2">
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setActiveReview(null)} disabled={submitting}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      {loading ? (
        <p>Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <div className="glass-card text-center">
          <Calendar size={40} color="var(--text-secondary)" style={{ margin: '0 auto 1rem' }} />
          <p>You have no bookings yet.</p>
        </div>
      ) : (
        <div className="grid-3">
          {bookings.map((booking) => (
            <div key={booking._id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
              <div className="flex justify-between items-start mb-1">
                <h4 className="mb-0">{booking.salon?.salonName || 'Unknown Salon'}</h4>
                <span style={{ 
                  padding: '4px 8px', 
                  borderRadius: '12px', 
                  fontSize: '0.8rem', 
                  fontWeight: 'bold',
                  background: booking.status === 'Confirmed' ? 'var(--success)' : booking.status === 'Cancelled' ? 'var(--error)' : 'var(--primary)',
                  color: 'white'
                }}>
                  {booking.status}
                </span>
              </div>
              <p className="flex items-center gap-1 mb-1" style={{ fontSize: '0.9rem' }}>
                <MapPin size={16} /> {booking.salon?.address || 'Location missing'}
              </p>
              <div style={{ padding: '0.5rem 0', borderTop: 'var(--glass-border)', borderBottom: 'var(--glass-border)', margin: '1rem 0' }}>
                <p className="mb-1"><strong>Service:</strong> {booking.service?.name}</p>
                <p className="mb-1 flex items-center gap-1">
                  <Calendar size={16} /> <strong>Date:</strong> {new Date(booking.slot?.date).toLocaleDateString()}
                </p>
                <p className="mb-0 flex items-center gap-1">
                  <Clock size={16} /> <strong>Time:</strong> {booking.slot?.startTime} - {booking.slot?.endTime}
                </p>
              </div>
              <div className="flex justify-between items-center mt-auto">
                <span style={{ fontWeight: 'bold' }}>${booking.totalAmount}</span>
                <div className="flex gap-2">
                  {booking.status === 'Completed' && !booking.isReviewed && (
                    <button 
                      onClick={() => setActiveReview({ salonId: booking.salon?._id, bookingId: booking._id })}
                      className="btn btn-primary" 
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                    >
                      Rate
                    </button>
                  )}
                  {booking.isReviewed && (
                    <span className="text-secondary" style={{ fontSize: '0.8rem', fontStyle: 'italic' }}>Reviewed</span>
                  )}
                  {booking.status !== 'Cancelled' && booking.status !== 'Completed' && (
                    <button 
                      onClick={() => handleCancel(booking._id)}
                      className="btn btn-secondary" 
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', borderColor: 'var(--error)', color: 'var(--error)' }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalons = async () => {
      try {
        const data = await salonController.getMySalons();
        setSalons(data.data || []);
      } catch (error) {
        console.error('Failed to fetch salons', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSalons();
  }, []);

  const handleDeleteSalon = async (id) => {
    if (!window.confirm("Are you sure you want to delete this salon? This action will deactivate it.")) return;
    try {
      await salonController.deleteSalon(id);
      alert("Salon deleted successfully");
      const data = await salonController.getMySalons();
      setSalons(data.data || []);
    } catch (err) {
      alert(err.message || "Failed to delete salon");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3>My Salons</h3>
        <button className="btn btn-primary" onClick={() => navigate('/dashboard/add-salon')}>Add New Salon</button>
      </div>
      {loading ? (
        <p>Loading your salons...</p>
      ) : salons.length === 0 ? (
        <div className="glass-card text-center">
          <p>You haven't registered any salons yet.</p>
        </div>
      ) : (
        <div className="grid-3">
          {salons.map(salon => (
            <div key={salon._id} className="glass-card">
              <h4 className="mb-1">{salon.salonName}</h4>
              <p className="mb-2"><MapPin size={14} style={{ display: 'inline' }}/> {salon.city}</p>
              <div className="mb-2">
                <span style={{
                  padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold',
                  background: salon.status === 'approved' ? 'var(--success)' : salon.status === 'pending' ? 'orange' : 'var(--error)',
                  color: 'white'
                }}>
                  Status: {salon.status}
                </span>
              </div>
              <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Bookings: {salon.totalBookings || 0}</p>
              <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>Revenue: ${salon.totalRevenue || 0}</p>
              <div className="flex gap-2">
                <button 
                  className="btn btn-secondary flex-1" 
                  onClick={() => navigate(`/dashboard/bookings?salonId=${salon._id}`)}
                >
                  Manage
                </button>
                <button 
                  className="btn flex-1" 
                  style={{ background: 'var(--error)', color: 'white' }}
                  onClick={() => handleDeleteSalon(salon._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const AdminDashboard = () => {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    try {
      const data = await salonController.getPendingSalons();
      setPending(data.data || []);
    } catch (error) {
      console.error('Failed to fetch pending salons', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleStatus = async (id, status) => {
    try {
      await salonController.updateSalonStatus(id, status);
      alert(`Salon successfully ${status}`);
      fetchPending();
    } catch (error) {
      alert(error.message || 'Failed to update status');
    }
  };

  return (
    <div>
      <h3 className="mb-2">Pending Salon Approvals</h3>
      {loading ? (
        <p>Loading pending salons...</p>
      ) : pending.length === 0 ? (
        <div className="glass-card text-center">
          <Check size={40} color="var(--success)" style={{ margin: '0 auto 1rem' }} />
          <p>All caught up! No pending salons.</p>
        </div>
      ) : (
        <div className="grid-3">
          {pending.map(salon => (
            <div key={salon._id} className="glass-card">
              <h4 className="mb-1">{salon.salonName}</h4>
              <p className="mb-1 text-secondary" style={{ fontSize: '0.9rem' }}>Owner ID: {salon.ownerId}</p>
              <p className="mb-2 flex items-center gap-1" style={{ fontSize: '0.9rem' }}>
                <MapPin size={16} /> {salon.address}, {salon.city}
              </p>
              <div className="flex gap-2">
                <button 
                  className="btn btn-primary flex-1 justify-center" 
                  style={{ background: 'var(--success)' }}
                  onClick={() => handleStatus(salon._id, 'approved')}
                >
                  <Check size={16} /> Approve
                </button>
                <button 
                  className="btn flex-1 justify-center" 
                  style={{ background: 'var(--error)', color: 'white' }}
                  onClick={() => handleStatus(salon._id, 'suspended')}
                >
                  <X size={16} /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  if (!user) return <div className="container mt-4 text-center">Please login to view your dashboard.</div>;

  return (
    <div className="container mt-4">
      <div className="glass-card mb-4">
        <h2>Welcome, {user.fullName}!</h2>
        <p>Email: {user.email}</p>
        <p>Role: <span style={{ textTransform: 'capitalize', fontWeight: 'bold', color: 'var(--accent)' }}>{user.role}</span></p>
      </div>

      {user.role === 'Customer' && <CustomerDashboard />}
      {user.role === 'Salon Owner' && <OwnerDashboard />}
      {user.role === 'Admin' && <AdminDashboard />}
    </div>
  );
};

export default Dashboard;
