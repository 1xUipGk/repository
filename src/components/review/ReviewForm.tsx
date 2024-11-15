'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { ref, push, set, Database } from 'firebase/database';
import { uploadToImgur } from '@/utils/imgur';
import { getFirebaseDB } from '@/lib/firebase';

interface TestimonialData {
  name: FormDataEntryValue | null;
  title: FormDataEntryValue | null;
  rating: number;
  text: FormDataEntryValue | null;
  createdAt: string;
  imageUrl?: string;
}

interface ReviewFormProps {
  onSubmit: (data: TestimonialData) => void;
}

export default function ReviewForm({ onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [db, setDb] = useState<Database | null>(null);

  useEffect(() => {
    const database = getFirebaseDB();
    setDb(database);
  }, []);

  const ratingTexts = [
    'بحاجة إلى تحسين',
    'مقبول',
    'جيد',
    'جيد جداً',
    'ممتاز'
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!db) {
      setError('لا يمكن الاتصال بقاعدة البيانات');
      setIsSubmitting(false);
      return;
    }

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      
      const testimonialData: TestimonialData = {
        name: formData.get('name'),
        title: formData.get('title'),
        rating: rating,
        text: formData.get('text'),
        createdAt: new Date().toISOString()
      };

      const imageFile = formData.get('clientImage') as File;
      if (imageFile && imageFile.size > 0) {
        try {
          const imgurData = await uploadToImgur(imageFile);
          testimonialData.imageUrl = imgurData.data.link;
        } catch (error) {
          console.error('Error uploading image:', error);
          setError('فشل في تحميل الصورة. الرجاء المحاولة مرة أخرى.');
          setIsSubmitting(false);
          return;
        }
      }

      const testimonialsRef = ref(db, 'testimonials');
      const newTestimonialRef = push(testimonialsRef);
      await set(newTestimonialRef, testimonialData);

      localStorage.setItem('hasReviewed', 'true');
      localStorage.setItem('reviewerName', testimonialData.name as string);
      localStorage.setItem('reviewDate', testimonialData.createdAt);

      onSubmit(testimonialData);
    } catch (error) {
      console.error('Error:', error);
      setError('حدث خطأ أثناء إرسال التقييم. الرجاء المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <h1 className="review-title">شاركني رأيك في خدماتي</h1>
      
      <div className="form-group">
        <label>الاسم</label>
        <input 
          type="text" 
          name="name" 
          required 
          maxLength={50}
          placeholder="أدخل اسمك الكامل"
        />
      </div>

      <div className="form-group">
        <label>المسمى الوظيفي</label>
        <input 
          type="text" 
          name="title" 
          required 
          maxLength={100}
          placeholder="مثال: صاحب مشروع"
        />
      </div>

      <div className="form-group">
        <label>صورتك الشخصية (اختياري)</label>
        <input 
          type="file" 
          name="clientImage" 
          accept="image/*"
          className="file-input"
        />
      </div>

      <div className="rating-group">
        <div className="rating-stars">
          {[...Array(5)].map((_, index) => (
            <FontAwesomeIcon
              key={index}
              icon={index < rating ? faStarSolid : faStarRegular}
              style={{ 
                color: index < rating ? '#FFD700' : 'rgba(255, 215, 0, 0.3)'
              }}
              className="cursor-pointer transition-transform hover:scale-110"
              onClick={() => setRating(index + 1)}
              onMouseEnter={() => setRating(index + 1)}
            />
          ))}
        </div>
        <span className="rating-text">{ratingTexts[rating - 1]}</span>
      </div>

      <div className="form-group">
        <label>رأيك في الخدمة</label>
        <textarea 
          name="text" 
          required 
          rows={4} 
          maxLength={500}
          placeholder="اكتب رأيك وانطباعك عن الخدمة المقدمة..."
        />
      </div>

      {error && (
        <div className="error-message text-red-500 text-center mb-4">
          {error}
        </div>
      )}

      <button 
        type="submit" 
        className="submit-btn" 
        disabled={isSubmitting}
      >
        {isSubmitting ? 'جاري الإرسال...' : 'إرسال تقييمك'}
      </button>
    </form>
  );
} 