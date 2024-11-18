'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';

interface ThankYouMessageProps {
  reviewerData: {
    name: string;
    createdAt?: string;
  };
}

export default function ThankYouMessage({ reviewerData }: ThankYouMessageProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="rv-thank-you">
      <FontAwesomeIcon 
        icon={faCircleCheck} 
        className="rv-thank-you-icon success"
      />
      <h2 className="rv-thank-you-title">تم استلام تقييمك</h2>
      <p className="rv-thank-you-text">
        أشكر لك مشاركتي رأيك
      </p>
      <div className="rv-thank-you-details">
        <div className="rv-detail-item">
          <span className="rv-detail-label">المقيم</span>
          <span className="rv-detail-value">{reviewerData.name}</span>
        </div>
        <div className="rv-detail-item">
          <span className="rv-detail-label">تاريخ التقييم</span>
          <span className="rv-detail-value" dir="ltr">
            {reviewerData.createdAt ? formatDate(reviewerData.createdAt) : ''}
          </span>
        </div>
      </div>
      <Link href="/" className="rv-back-btn">
        العودة للرئيسية
      </Link>
    </div>
  );
} 