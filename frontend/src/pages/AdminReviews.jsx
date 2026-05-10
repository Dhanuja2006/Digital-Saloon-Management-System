import React, { useState, useEffect } from 'react';
import api from '../controllers/api';
import { Trash2, Star } from 'lucide-react';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await api.get('/reviews');
      setReviews(response.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await api.delete(`/reviews/${id}`);
      setReviews(reviews.filter(r => r._id !== id));
    } catch (err) {
      alert("Failed to delete review");
    }
  };

  return (
    <div className="container">
      <h2 className="mb-4">Review Moderation</h2>
      {loading ? <p>Loading...</p> : (
        <div className="grid-2">
          {reviews.map(r => (
            <div key={r._id} className="glass-card flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <strong className="text-primary">{r.userId?.fullName}</strong>
                  <span className="text-secondary" style={{fontSize: '0.8rem'}}>on</span>
                  <strong>{r.salonId?.salonName}</strong>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < r.rating ? 'var(--accent)' : 'none'} color={i < r.rating ? 'var(--accent)' : 'var(--text-secondary)'} />
                  ))}
                </div>
                <p className="mb-0 italic" style={{fontSize: '0.95rem'}}>{r.comment || 'No comment provided.'}</p>
              </div>
              <button 
                onClick={() => handleDelete(r._id)} 
                className="btn btn-secondary" 
                style={{padding: '0.5rem', color: 'var(--error)', borderColor: 'var(--error)'}}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          {reviews.length === 0 && <p className="text-secondary">No reviews found.</p>}
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
