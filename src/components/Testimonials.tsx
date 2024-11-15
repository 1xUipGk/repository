'use client';

import { useEffect, useState, useRef } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getDatabase, ref, onValue, DataSnapshot } from 'firebase/database';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { faChevronLeft, faChevronRight, faUser } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB6tkZjsM5I4OkG8SvCk6v5pyeM6nTzGT4",
  authDomain: "task-manager-87577.firebaseapp.com",
  databaseURL: "https://task-manager-87577-default-rtdb.firebaseio.com",
  projectId: "task-manager-87577",
  storageBucket: "task-manager-87577.firebasestorage.app",
  messagingSenderId: "949071438979",
  appId: "1:949071438979:web:d2a0056c95b9e02e90e7b6",
  measurementId: "G-HMZ54Z29EZ"
};

// Initialize Firebase
let app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getDatabase(app);

interface Testimonial {
  name: string;
  title: string;
  text: string;
  rating: number;
  imageUrl?: string;
  createdAt: string;
}

const SkeletonTestimonial = () => (
  <div className="skeleton-testimonial">
    <div className="skeleton-avatar"></div>
    <div className="skeleton-name"></div>
    <div className="skeleton-title"></div>
    <div className="skeleton-rating"></div>
    <div className="skeleton-text"></div>
  </div>
);

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const testimonialsRef = ref(db, 'testimonials');
    
    const unsubscribe = onValue(testimonialsRef, (snapshot: DataSnapshot) => {
      const data: Testimonial[] = [];
      snapshot.forEach((childSnapshot: DataSnapshot) => {
        data.push(childSnapshot.val() as Testimonial);
      });
      
      setTestimonials(data.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const cardWidth = containerRef.current.querySelector('.testimonial-card')?.clientWidth ?? 0;
      const scrollAmount = direction === 'left' ? -cardWidth - 24 : cardWidth + 24;
      
      containerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <section className="testimonials">
        <div className="container2">
          <div className="section-header">
            <h2>آراء العملاء</h2>
          </div>
          <div className="testimonials-slider">
            <div className="testimonials-container">
              {[1, 2, 3].map((i) => (
                <SkeletonTestimonial key={i} />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="testimonials">
      <div className="container2">
        <div className="section-header">
          <h2>آراء العملاء</h2>
        </div>
        
        <div className="testimonials-slider">
          <button 
            className="nav-btn prev-btn"
            onClick={() => scroll('right')}
            aria-label="السابق"
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
          
          <button 
            className="nav-btn next-btn"
            onClick={() => scroll('left')}
            aria-label="التالي"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>

          <div className="testimonials-container" ref={containerRef}>
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="testimonial-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="testimonial-header">
                  <div className="client-info">
                    <div className="client-avatar">
                      {testimonial.imageUrl ? (
                        <Image
                          src={testimonial.imageUrl}
                          alt={testimonial.name}
                          width={48}
                          height={48}
                          className="user-avatar"
                        />
                      ) : (
                        <div className="avatar-placeholder">
                          {testimonial.name[0]}
                        </div>
                      )}
                    </div>
                    <div className="client-details">
                      <h3>{testimonial.name}</h3>
                      <p>{testimonial.title}</p>
                    </div>
                  </div>
                  <div className="rating">
                    {[...Array(5)].map((_, i) => (
                      <FontAwesomeIcon 
                        key={i}
                        icon={i < testimonial.rating ? faStarSolid : faStarRegular}
                      />
                    ))}
                  </div>
                </div>
                <p className="testimonial-text">{testimonial.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 