import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { salonController } from '../controllers/salonController';
import { serviceController } from '../controllers/serviceController';
import { slotController } from '../controllers/slotController';
import { bookingController } from '../controllers/bookingController';
import { AuthContext } from '../context/AuthContext';
import { MapPin, Star, Clock } from 'lucide-react';
import api from '../controllers/api';

const SalonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [salon, setSalon] = useState(null);
  const [services, setServices] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const salonData = await salonController.getSalonById(id);
        setSalon(salonData.data || salonData);

        const servicesData = await serviceController.getSalonServices(id);
        setServices(servicesData.data || []);

        const slotsData = await slotController.getSlots({ salonId: id, status: 'available' });
        setSlots(slotsData.data || []);
      } catch (err) {
        setError('Failed to load salon details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleBook = async (slotId) => {
    if (!user) {
      alert("Please login to book a slot");
      navigate('/login');
      return;
    }
    setBookingLoading(true);
    try {
      await bookingController.createBooking({ slotId });
      alert("Booking successful!");
      navigate('/dashboard');
    } catch (err) {
      alert(err.message || "Failed to book slot");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="container mt-4 text-center">Loading salon...</div>;
  if (error || !salon) return <div className="container mt-4 text-center" style={{ color: 'var(--error)' }}>{error || 'Salon not found'}</div>;

  return (
    <div className="container mt-4">
      <div className="glass-card mb-4" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ height: '300px', background: 'var(--bg-color-secondary)', position: 'relative' }}>
          {salon.images && salon.images.length > 0 && (
            <img src={`http://localhost:8000${salon.images[0]}`} alt={salon.salonName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          )}
          <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', padding: '2rem 1.5rem' }}>
            <h1 className="mb-1">{salon.salonName}</h1>
            <p className="flex items-center gap-1 mb-0" style={{ color: 'white' }}>
              <MapPin size={18} /> {salon.city} - {salon.address}
            </p>
          </div>
        </div>
      </div>

      <div className="grid-3 mb-4">
        <div className="glass-card" style={{ gridColumn: 'span 2' }}>
          <h2 className="mb-2">Services & Available Slots</h2>
          {services.length === 0 ? <p>No services found.</p> : (
            <div>
              {services.map(service => {
                const serviceSlots = slots.filter(s => s.serviceId === service._id);
                return (
                  <div key={service._id} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h3 className="mb-1">{service.name}</h3>
                        <p className="mb-0" style={{ fontSize: '0.9rem' }}>{service.duration} mins • {service.category}</p>
                      </div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary)' }}>${service.price}</div>
                    </div>
                    
                    <div>
                      <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Available Times:</h4>
                      {serviceSlots.length === 0 ? (
                        <p style={{ fontSize: '0.9rem' }}>No slots available right now.</p>
                      ) : (
                        <div className="flex" style={{ gap: '0.5rem', flexWrap: 'wrap' }}>
                          {serviceSlots.map(slot => (
                            <button 
                              key={slot._id} 
                              onClick={() => handleBook(slot._id)}
                              className="btn btn-secondary" 
                              style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                              disabled={bookingLoading}
                            >
                              <Clock size={14} /> {slot.startTime}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="glass-card h-fit" style={{ height: 'fit-content' }}>
          <h3 className="mb-2">About Salon</h3>
          <p>{salon.description || 'A premium digital salon experience.'}</p>
          <div className="mt-2 flex items-center gap-2">
            <Star size={20} color="var(--accent)" fill="var(--accent)" />
            <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{salon.rating || 'New'}</span>
            <span style={{ color: 'var(--text-secondary)' }}>({salon.totalReviews || 0} reviews)</span>
          </div>
        </div>
      </div>

      <div className="glass-card mt-4">
        <h2 className="mb-4">Customer Reviews</h2>
        <ReviewsList salonId={id} />
      </div>
    </div>
  );
};

const ReviewsList = ({ salonId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get(`/reviews/salon/${salonId}`);
        setReviews(response.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [salonId]);

  if (loading) return <p>Loading reviews...</p>;
  if (reviews.length === 0) return <p className="text-secondary">No reviews yet. Be the first!</p>;

  return (
    <div className="flex flex-col gap-4">
      {reviews.map(r => (
        <div key={r._id} style={{ borderBottom: 'var(--glass-border)', paddingBottom: '1rem' }}>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-color-secondary)', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontWeight: 'bold', fontSize: '0.8rem' }}>
                {r.userId?.fullName?.charAt(0)}
              </div>
              <strong>{r.userId?.fullName}</strong>
            </div>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill={i < r.rating ? 'var(--accent)' : 'none'} color={i < r.rating ? 'var(--accent)' : 'var(--text-secondary)'} />
              ))}
            </div>
          </div>
          <p className="mb-0 italic" style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>"{r.comment}"</p>
          <small className="text-secondary">{new Date(r.createdAt).toLocaleDateString()}</small>
        </div>
      ))}
    </div>
  );
};

export default SalonDetails;
