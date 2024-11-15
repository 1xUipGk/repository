'use client';

import { useEffect, useState } from 'react';
import { getDatabase, ref, query, limitToLast, onValue } from 'firebase/database';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';

interface Testimonial {
  id: string;
  name: string;
  title: string;
  text: string;
  rating: number;
  imageUrl?: string;
  createdAt: string;
}

const LoadingSkeleton = () => (
  <div className="testimonials-list">
    {[1, 2, 3].map((i) => (
      <div key={i} className="testimonial-item skeleton">
        <div className="testimonial-header">
          <div className="skeleton-avatar"></div>
          <div className="skeleton-content">
            <div className="skeleton-text-short"></div>
            <div className="skeleton-text-medium"></div>
          </div>
        </div>
        <div className="skeleton-text-long"></div>
        <div className="skeleton-text-short"></div>
      </div>
    ))}
  </div>
);

export default function RecentTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const db = getDatabase();
    const testimonialsRef = query(ref(db, 'testimonials'), limitToLast(5));

    const unsubscribe = onValue(testimonialsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const testimonialsArray = Object.entries(data).map(([id, testimonial]: [string, any]) => ({
          id,
          ...testimonial
        }));
        setTestimonials(testimonialsArray.reverse());
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="recent-testimonials">
        <h2>آخر التقييمات</h2>
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="recent-testimonials">
      <h2>آخر التقييمات</h2>
      <div className="testimonials-list">
        {testimonials.map(testimonial => (
          <div key={testimonial.id} className="testimonial-item">
            <div className="testimonial-header">
              <div className="user-info">
                {testimonial.imageUrl ? (
                  <Image
                    src={testimonial.imageUrl}
                    alt={testimonial.name}
                    width={40}
                    height={40}
                    className="user-avatar"
                  />
                ) : (
                  <div className="avatar-placeholder">
                    {testimonial.name[0]}
                  </div>
                )}
                <div className="testimonial-info">
                  <h3>{testimonial.name}</h3>
                  <span className="job-title">{testimonial.title}</span>
                  <div className="rating">
                    {[...Array(5)].map((_, index) => (
                      <FontAwesomeIcon
                        key={index}
                        icon={index < testimonial.rating ? faStarSolid : faStarRegular}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <p className="testimonial-text">{testimonial.text}</p>
            <time>{new Date(testimonial.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            })}</time>
          </div>
        ))}
      </div>
    </div>
  );
} 