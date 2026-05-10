import React, { useState, useEffect } from 'react';
import { salonController } from '../controllers/salonController';
import { X } from 'lucide-react';

const OwnerSalonProfile = () => {
  const [salons, setSalons] = useState([]);
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [formData, setFormData] = useState({
    salonName: '',
    address: '',
    city: '',
    email: '',
    phone: '',
    description: ''
  });

  useEffect(() => {
    fetchSalons();
  }, []);

  const fetchSalons = async (currentId = null) => {
    try {
      const data = await salonController.getMySalons();
      const fetchedSalons = data.data || [];
      setSalons(fetchedSalons);
      
      if (fetchedSalons.length > 0) {
        const toSelect = currentId 
          ? fetchedSalons.find(s => s._id === currentId) || fetchedSalons[0]
          : fetchedSalons[0];
        handleSelectSalon(toSelect);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectSalon = (salon) => {
    setSelectedSalon(salon);
    setFormData({
      salonName: salon.salonName,
      address: salon.address,
      city: salon.city,
      email: salon.email,
      phone: salon.phone,
      description: salon.description
    });
  };

  const handleDeleteImage = async (imagePath) => {
    if (!window.confirm("Are you sure you want to remove this image?")) return;
    try {
      await salonController.removeSalonImage(selectedSalon._id, imagePath);
      fetchSalons(selectedSalon._id);
    } catch (err) {
      alert(err.message || "Failed to remove image");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await salonController.updateSalon(selectedSalon._id, formData);
      alert("Salon updated successfully!");
      fetchSalons(selectedSalon._id);
    } catch (err) {
      alert("Failed to update salon");
    }
  };

  return (
    <div className="container">
      <h2 className="mb-4">Salon Profile</h2>
      <div className="grid-3 gap-4">
        <div className="glass-card">
          <h3 className="mb-3">Your Salons</h3>
          <div className="flex flex-col gap-2">
            {salons.map(s => (
              <button 
                key={s._id} 
                onClick={() => handleSelectSalon(s)}
                className={`btn btn-full ${selectedSalon?._id === s._id ? 'btn-primary' : 'btn-secondary'}`}
              >
                {s.salonName}
              </button>
            ))}
          </div>
        </div>

        <div className="glass-card" style={{ gridColumn: 'span 2' }}>
          <h3 className="mb-4">Edit Details</h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="grid-2">
              <div>
                <label className="text-secondary mb-1 block" style={{fontSize: '0.8rem'}}>Salon Name</label>
                <input type="text" className="glass-input w-full" value={formData.salonName} onChange={e => setFormData({...formData, salonName: e.target.value})} required />
              </div>
              <div>
                <label className="text-secondary mb-1 block" style={{fontSize: '0.8rem'}}>Business Email</label>
                <input type="email" className="glass-input w-full" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
              </div>
            </div>

            <div>
              <label className="text-secondary mb-1 block" style={{fontSize: '0.8rem'}}>Address</label>
              <input type="text" className="glass-input w-full" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} required />
            </div>

            <div className="grid-2">
              <div>
                <label className="text-secondary mb-1 block" style={{fontSize: '0.8rem'}}>City</label>
                <input type="text" className="glass-input w-full" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} required />
              </div>
              <div>
                <label className="text-secondary mb-1 block" style={{fontSize: '0.8rem'}}>Phone</label>
                <input type="tel" className="glass-input w-full" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
              </div>
            </div>

            <div>
              <label className="text-secondary mb-1 block" style={{fontSize: '0.8rem'}}>Description</label>
              <textarea className="glass-input w-full" rows="4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required></textarea>
            </div>

            <button type="submit" className="btn btn-primary mt-4">Save Changes</button>
          </form>

          {selectedSalon && (
            <div className="mt-5 pt-4" style={{ borderTop: '1px solid var(--glass-border)' }}>
              <h3 className="mb-4">Salon Gallery</h3>
              
              <div className="flex gap-4 mb-4 flex-wrap">
                {selectedSalon.images?.map((img, idx) => (
                  <div key={idx} style={{ position: 'relative', width: '120px', height: '120px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                    <img src={`http://localhost:8000${img}`} alt="Salon" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button 
                      onClick={() => handleDeleteImage(img)}
                      style={{ 
                        position: 'absolute', 
                        top: '5px', 
                        right: '5px', 
                        background: 'rgba(225, 29, 72, 0.8)', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '50%', 
                        width: '24px', 
                        height: '24px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        cursor: 'pointer',
                        zIndex: 10
                      }}
                      title="Remove image"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="glass-card" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <p className="mb-2" style={{ fontSize: '0.9rem' }}>Add new photos (Max 5 at once)</p>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={async (e) => {
                    const files = e.target.files;
                    if (files.length > 0) {
                      const formData = new FormData();
                      for (let i = 0; i < files.length; i++) {
                        formData.append('images', files[i]);
                      }
                      try {
                        await salonController.uploadSalonImages(selectedSalon._id, formData);
                        alert("Images uploaded successfully!");
                        fetchSalons(selectedSalon._id);
                      } catch (err) {
                        alert(err.message || "Upload failed");
                      }
                    }
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerSalonProfile;
