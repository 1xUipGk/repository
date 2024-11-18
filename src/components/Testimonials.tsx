'use client';

import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';

interface Testimonial {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    // يمكنك استبدال هذا بالبيانات الثابتة أو API آخر
    const dummyTestimonials = [
      {
        id: '1',
        name: 'أحمد',
        rating: 5,
        comment: 'خدمة ممتازة',
        date: new Date().toISOString()
      },
      // ... المزيد من التقييمات
    ];
    
    setTestimonials(dummyTestimonials);
  }, []);

  return (
    <div className="testimonials">
      {testimonials.map(testimonial => (
        <div key={testimonial.id} className="testimonial-card">
          <div className="rating">
            {[...Array(testimonial.rating)].map((_, i) => (
              <FontAwesomeIcon key={i} icon={faStarSolid} className="star" />
            ))}
          </div>
          <p className="comment">{testimonial.comment}</p>
          <div className="author">{testimonial.name}</div>
        </div>
      ))}
    </div>
  );
} 