import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

interface AlreadyReviewedProps {
  reviewerData: {
    name: string | null;
    date: string | null;
  };
}

export default function AlreadyReviewed({ reviewerData }: AlreadyReviewedProps) {
  const reviewDate = reviewerData.date ? new Date(reviewerData.date) : new Date();

  return (
    <div className="already-reviewed">
      <FontAwesomeIcon icon={faInfoCircle} className="text-4xl text-primary mb-6" />
      <h2>{reviewerData.name ? `عذراً ${reviewerData.name}!` : 'عذراً!'}</h2>
      <p>لقد قمت بتقييم خدماتي مسبقاً</p>
      <div className="review-details">
        <p>تم التقييم بتاريخ: {reviewDate.toLocaleDateString('ar-SA')}</p>
      </div>
      <Link href="/" className="back-btn">
        العودة للرئيسية
      </Link>
    </div>
  );
} 