import React, { useState, useEffect } from 'react';
import api from '../controllers/api';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchBookings();
  }, [filterStatus]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      // Assuming a generic endpoint for admin to see all bookings
      const response = await api.get(`/bookings${filterStatus ? `?status=${filterStatus}` : ''}`);
      setBookings(response.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-4">
        <h2>Global Booking Overview</h2>
        <select 
          className="glass-input" 
          value={filterStatus} 
          onChange={e => setFilterStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div className="glass-card">
        {loading ? <p>Loading...</p> : (
          <table className="w-full text-left">
            <thead>
              <tr style={{borderBottom: 'var(--glass-border)'}}>
                <th className="p-2">Customer</th>
                <th className="p-2">Salon</th>
                <th className="p-2">Service</th>
                <th className="p-2">Time</th>
                <th className="p-2">Status</th>
                <th className="p-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b._id} style={{borderBottom: 'var(--glass-border)'}}>
                  <td className="p-2">{b.user?.fullName}</td>
                  <td className="p-2">{b.salon?.salonName}</td>
                  <td className="p-2">{b.service?.name}</td>
                  <td className="p-2">
                    {new Date(b.slot?.date).toLocaleDateString()} <br/>
                    <small>{b.slot?.startTime}</small>
                  </td>
                  <td className="p-2">
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      background: b.status === 'Confirmed' ? 'var(--success)' : b.status === 'Cancelled' ? 'var(--error)' : 'var(--primary)',
                      color: 'white'
                    }}>{b.status}</span>
                  </td>
                  <td className="p-2">${b.totalAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;
