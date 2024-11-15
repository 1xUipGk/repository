'use client';

import { useState, useEffect } from 'react';
import ReviewForm from '@/components/review/ReviewForm';
import AlreadyReviewed from '@/components/review/AlreadyReviewed';
import ThankYouMessage from '@/components/review/ThankYouMessage';
import { initializeApp, getApps } from 'firebase/app';
import { getDatabase } from 'firebase/database';

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
export const db = getDatabase(app);

export default function ReviewPage() {
  const [hasReviewed, setHasReviewed] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [reviewerData, setReviewerData] = useState<any>(null);

  useEffect(() => {
    const reviewed = localStorage.getItem('hasReviewed');
    if (reviewed) {
      setHasReviewed(true);
      setReviewerData({
        name: localStorage.getItem('reviewerName'),
        date: localStorage.getItem('reviewDate')
      });
    }
  }, []);

  const onReviewSubmitted = (data: any) => {
    setShowThankYou(true);
    setReviewerData(data);
  };

  return (
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
  );
} 