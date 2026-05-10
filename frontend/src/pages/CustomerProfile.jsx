import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Phone, Settings } from 'lucide-react';

const CustomerProfile = () => {
  const { user } = useContext(AuthContext);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 className="mb-4">Profile Management</h2>
      <div className="flex items-center gap-4 mb-4">
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
          <User size={40} color="white" />
        </div>
        <div>
          <h2 className="mb-1">{user.fullName}</h2>
          <span style={{ padding: '4px 10px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', fontSize: '0.8rem', border: '1px solid rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{user.role}</span>
        </div>
      </div>
      
      <div className="flex flex-col gap-3 mt-4">
        <label className="text-secondary" style={{ fontSize: '0.9rem', marginBottom: '-8px' }}>Email Address</label>
        <div className="glass-input flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <Mail size={18} color="var(--primary)" /> {user.email}
        </div>
        
        <label className="text-secondary mt-2" style={{ fontSize: '0.9rem', marginBottom: '-8px' }}>Phone Number</label>
        <div className="glass-input flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <Phone size={18} color="var(--primary)" /> {user.phone || '+1 (555) 000-0000'}
        </div>
      </div>
      
      <button className="btn btn-primary mt-4 w-full flex items-center justify-center gap-2">
        <Settings size={18} /> Edit Profile Details
      </button>
    </div>
  );
};
export default CustomerProfile;
