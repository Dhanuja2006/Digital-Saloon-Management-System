import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Scissors, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to={user ? "/dashboard" : "/"} className="nav-brand">
          <Scissors className="icon" />
          <span>LuxeSalon</span>
        </Link>
        <div className="nav-links">
          {(!user || user.role === 'Customer') && (
            <>
              <Link to="/salons" className="nav-link">Discover</Link>
              <Link to="/ai/recommendation" className="nav-link">AI Recommendations</Link>
            </>
          )}
          {user ? (
            <>
              {user.role === 'Salon Owner' && <Link to="/dashboard" className="nav-link">My Salons</Link>}
              {user.role === 'Admin' && <Link to="/dashboard" className="nav-link">Admin Panel</Link>}
              <Link to="/dashboard" className="nav-link flex items-center gap-1">
                <User size={18} /> Dashboard
              </Link>
              <button onClick={handleLogout} className="btn btn-secondary flex items-center gap-1">
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Log In</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
