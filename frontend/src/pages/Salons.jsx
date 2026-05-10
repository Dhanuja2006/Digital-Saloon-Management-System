import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { salonController } from '../controllers/salonController';
import { MapPin, Star, Scissors } from 'lucide-react';

const Salons = () => {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchCity, setSearchCity] = useState('');

  const fetchSalons = async (city = '') => {
    setLoading(true);
    try {
      const data = await salonController.getAllSalons(city ? { city } : {});
      setSalons(data.data || data);
    } catch (err) {
      setError('Failed to fetch salons. Ensure backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalons();
  }, []);

  const handleFilter = () => {
    fetchSalons(searchCity);
  };

  const handleClear = () => {
    setSearchCity('');
    fetchSalons();
  };

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-6">
        <h2>Discover Salons</h2>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Search by city..." 
            className="glass-input" 
            style={{ width: '220px' }} 
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleFilter()}
          />
          <button className="btn btn-primary" onClick={handleFilter}>Filter</button>
          {searchCity && <button className="btn btn-secondary" onClick={handleClear}>Clear</button>}
        </div>
      </div>

      {loading ? (
        <div className="text-center mt-4">Loading salons...</div>
      ) : error ? (
        <div className="text-center mt-4" style={{ color: 'var(--error)' }}>{error}</div>
      ) : salons.length === 0 ? (
        <div className="text-center mt-4 glass-card">
          <Scissors size={48} color="var(--text-secondary)" style={{ margin: '0 auto 1rem' }} />
          <h3>No salons found</h3>
          <p>Be the first owner to register a salon!</p>
        </div>
      ) : (
        <div className="grid-3">
          {salons.map(salon => (
            <div key={salon._id} className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
              <div style={{ height: '150px', background: 'var(--bg-color-secondary)', position: 'relative' }}>
                {salon.images && salon.images.length > 0 ? (
                  <img src={`http://localhost:8000${salon.images[0]}`} alt={salon.salonName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div className="flex justify-center items-center h-full">
                    <Scissors size={40} color="var(--text-secondary)" />
                  </div>
                )}
                <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Star size={14} color="var(--accent)" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{salon.rating || 'New'}</span>
                </div>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <h3 className="mb-1">{salon.salonName}</h3>
                <p className="flex items-center gap-1 mb-2" style={{ fontSize: '0.9rem' }}>
                  <MapPin size={16} /> {salon.city || 'Location unknown'}
                </p>
                <Link to={`/salons/${salon._id}`} className="btn btn-primary btn-full">View Details</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Salons;
