import React, { useState, useEffect } from 'react';
import { slotController } from '../controllers/slotController';
import { serviceController } from '../controllers/serviceController';
import { salonController } from '../controllers/salonController';

const OwnerSlots = () => {
  const [salons, setSalons] = useState([]);
  const [selectedSalon, setSelectedSalon] = useState('');
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  
  const [formData, setFormData] = useState({ date: '', startTime: '09:00', endTime: '17:00', slotDuration: 30, capacity: 1 });

  useEffect(() => {
    salonController.getMySalons().then(data => {
      setSalons(data.data || []);
      if (data.data?.length > 0) setSelectedSalon(data.data[0]._id);
    });
  }, []);

  useEffect(() => {
    if (selectedSalon) {
      serviceController.getSalonServices(selectedSalon).then(data => {
        setServices(data.data || []);
        if (data.data?.length > 0) setSelectedService(data.data[0]._id);
      });
    }
  }, [selectedSalon]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    try {
      await slotController.generateSlots({ ...formData, salonId: selectedSalon, serviceId: selectedService });
      alert("Slots generated successfully!");
    } catch (err) {
      alert(err.message || "Failed to generate slots");
    }
  };

  return (
    <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 className="mb-4">Generate Booking Slots</h2>
      <form onSubmit={handleGenerate} className="flex flex-col gap-3">
        <div>
          <label className="text-secondary" style={{ fontSize: '0.9rem', marginBottom: '4px', display: 'block' }}>Select Salon</label>
          <select value={selectedSalon} onChange={e => setSelectedSalon(e.target.value)} className="glass-input w-full">
            {salons.map(s => <option key={s._id} value={s._id} style={{ color: 'black' }}>{s.salonName}</option>)}
          </select>
        </div>

        <div>
          <label className="text-secondary" style={{ fontSize: '0.9rem', marginBottom: '4px', display: 'block' }}>Select Service</label>
          <select value={selectedService} onChange={e => setSelectedService(e.target.value)} className="glass-input w-full">
            {services.map(s => <option key={s._id} value={s._id} style={{ color: 'black' }}>{s.name}</option>)}
          </select>
        </div>

        <div>
          <label className="text-secondary" style={{ fontSize: '0.9rem', marginBottom: '4px', display: 'block' }}>Date</label>
          <input type="date" className="glass-input w-full" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-secondary" style={{ fontSize: '0.9rem', marginBottom: '4px', display: 'block' }}>Start Time</label>
            <input type="time" className="glass-input w-full" required value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} />
          </div>
          <div className="flex-1">
            <label className="text-secondary" style={{ fontSize: '0.9rem', marginBottom: '4px', display: 'block' }}>End Time</label>
            <input type="time" className="glass-input w-full" required value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} />
          </div>
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-secondary" style={{ fontSize: '0.9rem', marginBottom: '4px', display: 'block' }}>Slot Duration (mins)</label>
            <input type="number" className="glass-input w-full" required value={formData.slotDuration} onChange={e => setFormData({...formData, slotDuration: e.target.value})} />
          </div>
          <div className="flex-1">
            <label className="text-secondary" style={{ fontSize: '0.9rem', marginBottom: '4px', display: 'block' }}>Capacity (per slot)</label>
            <input type="number" className="glass-input w-full" required value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} />
          </div>
        </div>

        <button type="submit" className="btn btn-primary mt-4 w-full">Generate Available Slots</button>
      </form>
    </div>
  );
};
export default OwnerSlots;
