import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { authController } from '../controllers/authController';

const VerifyEmail = () => {
  const [step, setStep] = useState(1); // 1: Confirm Email, 2: Enter OTP
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [location]);

  const handleSendOTP = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await authController.resendOTP(email);
      setMessage('Verification code sent! Please check your terminal console.');
      setStep(2);
    } catch (err) {
      setError(err.message || 'Failed to send code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    
    try {
      await authController.verifyEmail(email, otp);
      setMessage('Email verified successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (err) {
      setError(err.message || 'Verification failed. Please check the code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex justify-center items-center" style={{ minHeight: '70vh' }}>
      <div className="glass-card" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-2">Verify Account</h2>
        
        {step === 1 ? (
          <>
            <p className="text-center mb-4" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Enter your email to receive a 6-digit verification code.
            </p>
            {error && <div style={{ color: 'var(--error)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
            <form onSubmit={handleSendOTP}>
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
              <button type="submit" className="btn btn-primary btn-full" disabled={loading || !email}>
                {loading ? 'Sending...' : 'Send Verification Code'}
              </button>
            </form>
          </>
        ) : (
          <>
            <p className="text-center mb-4" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Code sent to <strong>{email}</strong>. 
              <br />
              <span style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>(Check your terminal console)</span>
            </p>
            {error && <div style={{ color: 'var(--error)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
            {message && <div style={{ color: 'var(--success)', marginBottom: '1rem', textAlign: 'center' }}>{message}</div>}
            
            <form onSubmit={handleVerify}>
              <div className="form-group">
                <label className="form-label text-center">Enter 6-Digit Code</label>
                <input 
                  type="text" 
                  className="form-input text-center" 
                  placeholder="000000"
                  value={otp} 
                  onChange={(e) => setOtp(e.target.value)} 
                  required 
                  maxLength={6}
                  style={{ letterSpacing: '0.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}
                />
              </div>
              <button type="submit" className="btn btn-primary btn-full" disabled={loading || otp.length < 6}>
                {loading ? 'Verifying...' : 'Verify & Continue'}
              </button>
            </form>
            <div className="text-center mt-4">
              <button 
                onClick={() => setStep(1)} 
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                ← Use a different email
              </button>
              <span style={{ margin: '0 10px', color: 'var(--border)' }}>|</span>
              <button 
                onClick={handleSendOTP} 
                style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                Resend Code
              </button>
            </div>
          </>
        )}
        
        <p className="text-center mt-4" style={{ fontSize: '0.9rem' }}>
          Back to <Link to="/login" style={{ color: 'var(--primary)' }}>Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
