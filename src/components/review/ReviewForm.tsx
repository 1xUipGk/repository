'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';

interface ReviewFormProps {
  onSubmit: (data: any) => void;
}

export default function ReviewForm({ onSubmit }: ReviewFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    rating: 5,
    comment: '',
    image: null as File | null
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await onSubmit({
        ...formData,
        date: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <div className="form-group">
        <label htmlFor="name">الاسم</label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label>التقييم</label>
        <div className="rating">
          {[5, 4, 3, 2, 1].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setFormData({ ...formData, rating: star })}
              className="star-button"
            >
              <FontAwesomeIcon
                icon={formData.rating >= star ? faStarSolid : faStarRegular}
                className={formData.rating >= star ? 'star-filled' : 'star-empty'}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="comment">التعليق</label>
        <textarea
          id="comment"
          value={formData.comment}
          onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
          required
        />
      </div>

      <button 
        type="submit" 
        className="submit-button"
        disabled={submitting}
      >
        {submitting ? 'جاري الإرسال...' : 'إرسال التقييم'}
      </button>
    </form>
  );
} 