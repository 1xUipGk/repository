'use client';

import { useEffect, useState } from 'react';
import IconProvider from '@/components/IconProvider';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
}

export default function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // يمكنك استبدال هذا بالبيانات الثابتة أو API آخر
    const dummyProjects = [
      {
        id: '1',
        title: 'مشروع 1',
        description: 'وصف المشروع الأول',
        imageUrl: '/images/portfolio/1.jpg',
        category: 'تصميم'
      },
      // ... المزيد من المشاريع
    ];
    
    setProjects(dummyProjects);
    setLoading(false);
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <IconProvider>
      <div className="portfolio-container">
        {projects.map(project => (
          <div key={project.id} className="portfolio-item">
            <img src={project.imageUrl} alt={project.title} />
            <div className="portfolio-info">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <span className="category">{project.category}</span>
            </div>
          </div>
        ))}
      </div>
    </IconProvider>
  );
} 