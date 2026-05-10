import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { serviceController } from '../controllers/serviceController';
import { salonController } from '../controllers/salonController';

const OwnerServices = () => {
  const [salons, setSalons] = useState([]);
  const [selectedSalon, setSelectedSalon] = useState('');
  const [services, setServices] = useState([]);
  
  const [newService, setNewService] = useState({ name: '', category: 'Haircut', price: '', duration: '' });

  useEffect(() => {
    salonController.getMySalons().then(data => {
      setSalons(data.data || []);
      if (data.data?.length > 0) setSelectedSalon(data.data[0]._id);
    });
  }, []);

  useEffect(() => {
    if (selectedSalon) {
      serviceController.getSalonServices(selectedSalon).then(data => setServices(data.data || []));
    }
  }, [selectedSalon]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await serviceController.createService({ ...newService, salonId: selectedSalon });
      serviceController.getSalonServices(selectedSalon).then(data => setServices(data.data || []));
      setNewService({ name: '', category: 'Haircut', price: '', duration: '' });
      alert("Service added");
    } catch (err) {
      alert("Failed to add service");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    try {
      await serviceController.deleteService(id);
      serviceController.getSalonServices(selectedSalon).then(data => setServices(data.data || []));
      alert("Service deleted");
    } catch (err) {
      alert("Failed to delete service");
    }
  };

  return (
    <div className="grid-2">
      <div>
        <h2 className="mb-4">Your Services</h2>
        {salons.length > 0 && (
          <select value={selectedSalon} onChange={e => setSelectedSalon(e.target.value)} className="glass-input mb-4 w-full">
            {salons.map(s => <option key={s._id} value={s._id} style={{ color: 'black' }}>{s.salonName}</option>)}
          </select>
        )}
        <div className="flex flex-col gap-2">
          {services.map(s => (
            <div key={s._id} className="glass-card" style={{ padding: '1rem' }}>
              <div className="flex justify-between items-start mb-1">
                <div>
                  <strong style={{ fontSize: '1.1rem', display: 'block' }}>{s.name}</strong>
                  <p className="mb-0" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{s.duration} mins | {s.category}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>${s.price}</span>
                  <button 
                    onClick={() => handleDelete(s._id)}
                    className="btn-secondary"
                    style={{ padding: '0.3rem', border: 'none', color: 'var(--error)', background: 'transparent' }}
                    title="Delete Service"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {services.length === 0 && <p className="text-secondary">No services added yet.</p>}
        </div>
      </div>
      <div>
        <div className="glass-card sticky" style={{ top: '90px' }}>
          <h3 className="mb-4">Add New Service</h3>
          <form onSubmit={handleCreate} className="flex flex-col gap-3">
            <input type="text" placeholder="Service Name" className="glass-input w-full" required value={newService.name} onChange={e => setNewService({...newService, name: e.target.value})} />
            <select className="glass-input w-full" value={newService.category} onChange={e => setNewService({...newService, category: e.target.value})}>
              <option value="Haircut" style={{color: 'black'}}>Haircut</option>
              <option value="Coloring" style={{color: 'black'}}>Coloring</option>
              <option value="Facial" style={{color: 'black'}}>Facial</option>
              <option value="Styling" style={{color: 'black'}}>Styling</option>
              <option value="Spa" style={{color: 'black'}}>Spa</option>
              <option value="Other" style={{color: 'black'}}>Other</option>
            </select>
            <input type="number" placeholder="Price ($)" className="glass-input w-full" required value={newService.price} onChange={e => setNewService({...newService, price: e.target.value})} />
            <input type="number" placeholder="Duration (mins)" className="glass-input w-full" required value={newService.duration} onChange={e => setNewService({...newService, duration: e.target.value})} />
            <button type="submit" className="btn btn-primary mt-2">Add Service</button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default OwnerServices;
