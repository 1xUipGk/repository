'use client';

import { useState, useEffect } from 'react';
import ReviewForm from '@/components/review/ReviewForm';
import AlreadyReviewed from '@/components/review/AlreadyReviewed';
import ThankYouMessage from '@/components/review/ThankYouMessage';
import { initializeApp, getApps } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const database = getDatabase(app);

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