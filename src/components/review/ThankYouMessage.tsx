import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

interface ThankYouMessageProps {
  reviewerData: {
    name: string;
    createdAt?: string;
  };
}

export default function ThankYouMessage({ reviewerData }: ThankYouMessageProps) {
  return (
    <div className="thank-you-content">
      <FontAwesomeIcon 
        icon={faCheckCircle} 
        className="text-5xl text-green-500 mb-6"
      />
      <h2>شكراً {reviewerData.name} على تقييمك!</h2>
      <p>تم إرسال تقييمك بنجاح</p>
      <Link href="/" className="back-btn">
        العودة للرئيسية
      </Link>
    </div>
  );
} 