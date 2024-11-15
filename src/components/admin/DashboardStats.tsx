'use client';

import { useEffect, useState } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faImages, 
  faComments, 
  faEye
} from '@fortawesome/free-solid-svg-icons';

export default function DashboardStats() {
  const [stats, setStats] = useState({
    totalWorks: 0,
    totalTestimonials: 0,
    totalViews: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const db = getDatabase();
      
      try {
        const [worksSnap, testimonialsSnap, viewsSnap] = await Promise.all([
          get(ref(db, 'works')),
          get(ref(db, 'testimonials')),
          get(ref(db, 'views'))
        ]);

        setStats({
          totalWorks: worksSnap.exists() ? Object.keys(worksSnap.val()).length : 0,
          totalTestimonials: testimonialsSnap.exists() ? Object.keys(testimonialsSnap.val()).length : 0,
          totalViews: viewsSnap.exists() ? viewsSnap.val() : 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="stats-grid">
        {[1, 2, 3].map((i) => (
          <div key={i} className="stat-card skeleton">
            <div className="stat-icon skeleton-icon"></div>
            <div className="stat-info">
              <div className="skeleton-text-short"></div>
              <div className="skeleton-text-long"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon">
          <FontAwesomeIcon icon={faImages} />
        </div>
        <div className="stat-info">
          <h3>الأعمال</h3>
          <p>{stats.totalWorks}</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">
          <FontAwesomeIcon icon={faComments} />
        </div>
        <div className="stat-info">
          <h3>التقييمات</h3>
          <p>{stats.totalTestimonials}</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">
          <FontAwesomeIcon icon={faEye} />
        </div>
        <div className="stat-info">
          <h3>المشاهدات</h3>
          <p>{stats.totalViews}</p>
        </div>
      </div>
    </div>
  );
} 