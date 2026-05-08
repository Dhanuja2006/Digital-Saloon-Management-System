import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authController } from '../controllers/authController';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await authController.forgotPassword(email);
      setMessage('OTP has been sent to your email.');
      setTimeout(() => {
        navigate('/reset-password', { state: { email } });
      }, 2000);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex justify-center items-center" style={{ minHeight: '70vh' }}>
      <div className="glass-card" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">Forgot Password</h2>
        <p className="text-center mb-4" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Enter your email address and we'll send you an OTP to reset your password.
        </p>
        
        {error && <div className="alert alert-error mb-4">{error}</div>}
        {message && <div className="alert alert-success mb-4">{message}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-input" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="name@example.com"
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>
        
        <div className="text-center mt-4">
          <Link to="/login" style={{ color: 'var(--primary)', fontSize: '0.9rem' }}>
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
