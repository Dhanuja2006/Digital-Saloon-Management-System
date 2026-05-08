import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authController } from '../controllers/authController';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const data = await authController.login(email, password);
      login(data.accessToken, data.user);
      navigate('/');
    } catch (err) {
      const errorMessage = err.message || 'Failed to login';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isUnverified = error && error.toLowerCase().includes('verify');

  return (
    <div className="container flex justify-center items-center" style={{ minHeight: '70vh' }}>
      <div className="glass-card" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">Welcome Back</h2>
        {error && (
          <div style={{ color: 'var(--error)', marginBottom: '1rem', textAlign: 'center' }}>
            {error}
            {isUnverified && (
              <div className="mt-2">
                <button 
                  onClick={() => navigate(`/verify-email?email=${email}`)}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}
                >
                  Verify Now
                </button>
              </div>
            )}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              className="form-input" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <div className="text-right mb-3">
            <Link to="/forgot-password" style={{ color: 'var(--primary)', fontSize: '0.85rem' }}>
              Forgot Password?
            </Link>
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        
        <p className="text-center mt-2" style={{ fontSize: '0.9rem' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary)' }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
