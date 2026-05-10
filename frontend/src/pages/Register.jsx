import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authController } from '../controllers/authController';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    role: 'Customer', // default role
    adminCode: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const data = await authController.register(formData);
      // Navigate to verification page with demoOTP if it exists
      const query = new URLSearchParams({ email: data.email || formData.email });
      if (data.demoOTP) query.append('otp', data.demoOTP);
      navigate(`/verify-email?${query.toString()}`);
    } catch (err) {
      setError(err.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex justify-center items-center" style={{ minHeight: '70vh' }}>
      <div className="glass-card" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">Create Account</h2>
        {error && <div style={{ color: 'var(--error)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              name="fullName"
              className="form-input" 
              value={formData.fullName} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              name="email"
              className="form-input" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input 
              type="tel" 
              name="phone"
              className="form-input" 
              value={formData.phone} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              name="password"
              className="form-input" 
              value={formData.password} 
              onChange={handleChange} 
              required 
              minLength={8}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Account Type</label>
            <select 
              name="role" 
              className="form-input" 
              value={formData.role} 
              onChange={handleChange}
            >
              <option value="Customer">Customer</option>
              <option value="Salon Owner">Salon Owner</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          {formData.role === 'Admin' && (
            <div className="form-group">
              <label className="form-label">Admin Secret Code</label>
              <input 
                type="password" 
                name="adminCode"
                className="form-input" 
                placeholder="Enter secret code"
                value={formData.adminCode} 
                onChange={handleChange} 
                required 
              />
            </div>
          )}
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        
        <p className="text-center mt-2" style={{ fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)' }}>Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
