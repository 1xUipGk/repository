'use client';

import { useState } from 'react';
import IconProvider from '@/components/IconProvider';
import ReviewForm from '@/components/review/ReviewForm';
import AlreadyReviewed from '@/components/review/AlreadyReviewed';
import ThankYouMessage from '@/components/review/ThankYouMessage';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function ReviewPage() {
  const [hasReviewed, setHasReviewed] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [reviewerData, setReviewerData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const onReviewSubmitted = async (data: any) => {
    setLoading(true);
    try {
      // يمكنك استبدال هذا بـ API آخر لحفظ المراجعات
      localStorage.setItem('hasReviewed', 'true');
      localStorage.setItem('reviewerName', data.name);
      localStorage.setItem('reviewDate', new Date().toISOString());
      
      setShowThankYou(true);
      setReviewerData(data);
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <IconProvider>
      <div className="review-container">
        <div className="review-card">
          {showThankYou ? (
            <ThankYouMessage reviewerData={reviewerData} />
          ) : hasReviewed ? (
            <AlreadyReviewed reviewerData={reviewerData} />
          ) : (
            <ReviewForm onSubmit={onReviewSubmitted} />
          )}
        </div>
      </div>
    </IconProvider>
  );
} 