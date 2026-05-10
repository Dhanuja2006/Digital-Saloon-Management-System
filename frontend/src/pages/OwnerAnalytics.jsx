import React, { useState, useEffect } from 'react';
import { salonController } from '../controllers/salonController';

const OwnerAnalytics = () => {
  const [salons, setSalons] = useState([]);
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSalons();
  }, []);

  const fetchSalons = async () => {
    try {
      const data = await salonController.getMySalons();
      setSalons(data.data || []);
      if (data.data?.length > 0) {
        handleSelectSalon(data.data[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectSalon = async (salon) => {
    setSelectedSalon(salon);
    setLoading(true);
    try {
      const data = await salonController.getSalonAnalytics(salon._id);
      setAnalytics(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-6">
        <h2>Salon Analytics</h2>
        <div className="flex gap-2">
          {salons.map(s => (
            <button 
              key={s._id} 
              onClick={() => handleSelectSalon(s)}
              className={`btn btn-sm ${selectedSalon?._id === s._id ? 'btn-primary' : 'btn-secondary'}`}
            >
              {s.salonName}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center p-5">Loading analytics...</div>
      ) : analytics ? (
        <div className="flex flex-col gap-6">
          {/* Stats Overview */}
          <div className="grid-4 gap-4">
            <div className="glass-card text-center">
              <p className="text-secondary mb-1">Total Revenue</p>
              <h3 style={{ color: 'var(--primary)' }}>₹{analytics.stats.totalRevenue}</h3>
            </div>
            <div className="glass-card text-center">
              <p className="text-secondary mb-1">Total Bookings</p>
              <h3>{analytics.stats.totalBookings}</h3>
            </div>
            <div className="glass-card text-center">
              <p className="text-secondary mb-1">Completed</p>
              <h3 style={{ color: 'var(--success)' }}>{analytics.stats.completedBookings}</h3>
            </div>
            <div className="glass-card text-center">
              <p className="text-secondary mb-1">Cancelled</p>
              <h3 style={{ color: 'var(--error)' }}>{analytics.stats.cancelledBookings}</h3>
            </div>
          </div>

          <div className="grid-2 gap-4">
            {/* Service Breakdown */}
            <div className="glass-card">
              <h3 className="mb-4">Service Popularity</h3>
              <div className="flex flex-col gap-3">
                {analytics.serviceStats.map((service, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between mb-1" style={{ fontSize: '0.9rem' }}>
                      <span>{service.name}</span>
                      <span className="text-secondary">{service.count} bookings</span>
                    </div>
                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          height: '100%', 
                          width: `${(service.count / analytics.stats.totalBookings) * 100}%`, 
                          background: 'var(--primary)',
                          borderRadius: '4px'
                        }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="glass-card">
              <h3 className="mb-4">Recent Bookings</h3>
              <div className="flex flex-col gap-3">
                {analytics.recentBookings.map((booking, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2" style={{ borderBottom: '1px solid var(--glass-border)', fontSize: '0.9rem' }}>
                    <div>
                      <p className="font-bold">{booking.user.fullName}</p>
                      <p className="text-secondary" style={{ fontSize: '0.8rem' }}>{booking.service.name}</p>
                    </div>
                    <div className="text-right">
                      <p>₹{booking.totalAmount}</p>
                      <p style={{ 
                        fontSize: '0.75rem', 
                        color: booking.status === 'Completed' ? 'var(--success)' : booking.status === 'Cancelled' ? 'var(--error)' : 'var(--warning)' 
                      }}>
                        {booking.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card text-center p-10">
          <p>No analytics data available. Select a salon to view details.</p>
        </div>
      )}
    </div>
  );
};

export default OwnerAnalytics;
