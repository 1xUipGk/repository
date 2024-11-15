'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import AdminLayout from '@/components/admin/AdminLayout';
import DashboardStats from '@/components/admin/DashboardStats';
import RecentWorks from '@/components/admin/RecentWorks';
import RecentTestimonials from '@/components/admin/RecentTestimonials';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export default function Dashboard() {
  const [authLoading, setAuthLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/admin/login');
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (authLoading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="dashboard-container">
        <DashboardStats />
        <div className="dashboard-grid">
          <RecentWorks />
          <RecentTestimonials />
        </div>
      </div>
    </AdminLayout>
  );
} 