'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

interface AlreadyReviewedProps {
  reviewerData: {
    name: string | null;
    date: string | null;
  };
}

export default function AlreadyReviewed({ reviewerData }: AlreadyReviewedProps) {
  const reviewDate = reviewerData.date ? new Date(reviewerData.date) : new Date();

  return (
    <div className="rv-thank-you">
      <FontAwesomeIcon 
        icon={faCircleExclamation} 
        className="rv-thank-you-icon warning"
      />
      <h2 className="rv-thank-you-title">
        {reviewerData.name ? `عذراً ${reviewerData.name}` : 'عذراً'}
      </h2>
      <p className="rv-thank-you-text">
        لقد قمت بتقييم خدماتي مسبقاً بتاريخ <span dir="ltr">{reviewDate.toLocaleDateString('en-US')}</span>
      </p>
      <Link href="/" className="rv-back-btn">
        العودة للرئيسية
      </Link>
    </div>
  );
} 