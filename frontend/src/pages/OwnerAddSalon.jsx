import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { salonController } from '../controllers/salonController';

const OwnerAddSalon = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    salonName: '',
    address: '',
    city: '',
    email: '',
    phone: '',
    description: ''
  });

  useEffect(() => {
    if (user && user.email) {
      setFormData(prev => ({ ...prev, email: user.email }));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await salonController.createSalon(formData);
      alert("Salon added successfully! Awaiting admin approval.");
      navigate('/dashboard');
    } catch (err) {
      alert(err.message || "Failed to add salon");
    }
  };

  return (
    <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 className="mb-4">Register New Salon</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="text-secondary" style={{ fontSize: '0.9rem', marginBottom: '4px', display: 'block' }}>Salon Name</label>
          <input type="text" placeholder="e.g. Luxe Hair Studio" className="glass-input w-full" required value={formData.salonName} onChange={e => setFormData({...formData, salonName: e.target.value})} />
        </div>
        
        <div>
          <label className="text-secondary" style={{ fontSize: '0.9rem', marginBottom: '4px', display: 'block' }}>Street Address</label>
          <input type="text" placeholder="123 Main St" className="glass-input w-full" required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-secondary" style={{ fontSize: '0.9rem', marginBottom: '4px', display: 'block' }}>City</label>
            <input type="text" placeholder="New York" className="glass-input w-full" required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
          </div>
          <div className="flex-1">
            <label className="text-secondary" style={{ fontSize: '0.9rem', marginBottom: '4px', display: 'block' }}>Salon Email</label>
            <input type="email" placeholder="salon@example.com" className="glass-input w-full" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
        </div>

        <div>
          <label className="text-secondary" style={{ fontSize: '0.9rem', marginBottom: '4px', display: 'block' }}>Business Phone</label>
          <input type="tel" placeholder="+1 (555) 000-0000" className="glass-input w-full" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
        </div>

        <div>
          <label className="text-secondary" style={{ fontSize: '0.9rem', marginBottom: '4px', display: 'block' }}>Description</label>
          <textarea placeholder="Tell us about your salon..." className="glass-input w-full" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3}></textarea>
        </div>
        
        <div className="flex gap-2 mt-4">
          <button type="button" className="btn btn-secondary flex-1" onClick={() => navigate('/dashboard')}>Cancel</button>
          <button type="submit" className="btn btn-primary flex-1">Register Salon</button>
        </div>
      </form>
    </div>
  );
};
export default OwnerAddSalon;
