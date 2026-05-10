import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { bookingController } from '../controllers/bookingController';
import { salonController } from '../controllers/salonController';

const OwnerBookings = () => {
  const [searchParams] = useSearchParams();
  const [salons, setSalons] = useState([]);
  const [selectedSalon, setSelectedSalon] = useState(searchParams.get('salonId') || '');
  const [bookings, setBookings] = useState([]);
  
  useEffect(() => {
    salonController.getMySalons().then(data => {
      const salonList = data.data || [];
      setSalons(salonList);
      if (salonList.length > 0 && !selectedSalon) {
        setSelectedSalon(salonList[0]._id);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedSalon) {
      bookingController.getSalonBookings(selectedSalon).then(data => setBookings(data.data || []));
    }
  }, [selectedSalon]);

  const handleStatusUpdate = async (bookingId, status) => {
    try {
      await bookingController.updateBookingStatus(bookingId, status);
      alert(`Booking marked as ${status}`);
      bookingController.getSalonBookings(selectedSalon).then(data => setBookings(data.data || []));
    } catch (err) {
      alert(err.message || "Failed to update status");
    }
  };

  return (
    <div>
      <h2 className="mb-4">Salon Bookings</h2>
      {salons.length > 0 && (
        <select value={selectedSalon} onChange={e => setSelectedSalon(e.target.value)} className="glass-input mb-4 w-full">
          {salons.map(s => <option key={s._id} value={s._id} style={{ color: 'black' }}>{s.salonName}</option>)}
        </select>
      )}
      
      <div className="grid-3">
        {bookings.map(b => (
          <div key={b._id} className="glass-card flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <h4 className="mb-0">{b.user?.fullName}</h4>
              <span style={{ 
                padding: '2px 8px', 
                borderRadius: '12px', 
                background: b.status === 'Confirmed' ? 'var(--primary)' : b.status === 'Completed' ? 'var(--success)' : 'var(--error)', 
                fontSize: '0.8rem', 
                color: 'white' 
              }}>{b.status}</span>
            </div>
            <p className="mb-1"><strong>Service:</strong> {b.service?.name}</p>
            <p className="mb-1"><strong>Date:</strong> {new Date(b.slot?.date).toLocaleDateString()}</p>
            <p className="mb-2"><strong>Time:</strong> {b.slot?.startTime} - {b.slot?.endTime}</p>
            
            <div className="mt-auto pt-3 flex justify-between items-center" style={{ borderTop: 'var(--glass-border)' }}>
              <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>${b.totalAmount}</span>
              {b.status === 'Confirmed' && (
                <div className="flex gap-1">
                  <button onClick={() => handleStatusUpdate(b._id, 'Completed')} className="btn btn-primary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>Complete</button>
                  <button onClick={() => handleStatusUpdate(b._id, 'Cancelled')} className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', color: 'var(--error)', borderColor: 'var(--error)' }}>Cancel</button>
                </div>
              )}
            </div>
          </div>
        ))}
        {bookings.length === 0 && <p className="text-secondary">No bookings found for this salon.</p>}
      </div>
    </div>
  );
};
export default OwnerBookings;
