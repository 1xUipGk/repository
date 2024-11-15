'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getDatabase, ref, query, limitToLast, onValue } from 'firebase/database';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Work {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  createdAt: string;
}

const LoadingSkeleton = () => (
  <div className="works-list">
    {[1, 2, 3].map((i) => (
      <div key={i} className="work-item skeleton">
        <div className="skeleton-image"></div>
        <div className="skeleton-content">
          <div className="skeleton-text-short"></div>
          <div className="skeleton-text-medium"></div>
          <div className="skeleton-text-short"></div>
        </div>
      </div>
    ))}
  </div>
);

export default function RecentWorks() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const db = getDatabase();
    const worksRef = query(ref(db, 'works'), limitToLast(5));

    const unsubscribe = onValue(worksRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const worksArray = Object.entries(data).map(([id, work]: [string, any]) => ({
          id,
          ...work
        }));
        setWorks(worksArray.reverse());
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="recent-works">
        <div className="works-header">
          <h2>آخر الأعمال</h2>
          <div className="skeleton-button"></div>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="recent-works">
      <div className="works-header">
        <h2>آخر الأعمال</h2>
        <button 
          onClick={() => router.push('/admin/works')}
          className="view-all-btn"
        >
          عرض الكل
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
      </div>
      <div className="works-list">
        {works.map(work => (
          <div 
            key={work.id} 
            className="work-item"
            onClick={() => router.push('/admin/works')}
          >
            <div className="work-image">
              <Image
                src={work.imageUrl}
                alt={work.title}
                width={100}
                height={100}
                className="rounded"
              />
            </div>
            <div className="work-info">
              <h3>{work.title}</h3>
              <p>{work.category}</p>
              <time>{new Date(work.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
              })}</time>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 