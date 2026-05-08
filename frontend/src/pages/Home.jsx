import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Search, Star } from 'lucide-react';

const Home = () => {
  return (
    <div>
      <section className="hero">
        <div className="container">
          <h1 className="mb-2">Discover Premium Salons Near You</h1>
          <p className="mb-4 text-center mx-auto" style={{ maxWidth: '600px' }}>
            Book appointments, explore services, and experience the ultimate luxury. 
            Join the digital revolution in salon management.
          </p>
          <div className="flex justify-center gap-2">
            <Link to="/salons" className="btn btn-primary">
              <Search size={20} /> Explore Salons
            </Link>
            <Link to="/register" className="btn btn-secondary">
              Join as Partner
            </Link>
          </div>
        </div>
      </section>

      <section className="container mt-4 mb-4">
        <h2 className="text-center mb-4">Why Choose LuxeSalon?</h2>
        <div className="grid-3">
          <div className="glass-card text-center">
            <div className="flex justify-center mb-2">
              <Search size={40} color="var(--primary)" />
            </div>
            <h3>Advanced Discovery</h3>
            <p>Find the best salons by location, services, and ratings instantly.</p>
          </div>
          <div className="glass-card text-center">
            <div className="flex justify-center mb-2">
              <Calendar size={40} color="var(--accent)" />
            </div>
            <h3>Smart Booking</h3>
            <p>Seamlessly book appointments with real-time slot availability.</p>
          </div>
          <div className="glass-card text-center">
            <div className="flex justify-center mb-2">
              <Star size={40} color="var(--success)" />
            </div>
            <h3>Verified Reviews</h3>
            <p>Read authentic reviews from customers who have experienced the services.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
