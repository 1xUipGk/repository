'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, onValue, remove, push, set } from 'firebase/database';
import { auth } from '@/lib/firebase';
import AdminLayout from '@/components/admin/AdminLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faEdit, 
  faTrash, 
  faStar as faStarSolid, 
  faSpinner, 
  faUpload 
} from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import Image from 'next/image';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import Notification from '@/components/admin/Notification';
import LoadingSpinner from '@/components/LoadingSpinner';
import { uploadImageToFirebase } from '@/lib/firebase';

interface Testimonial {
  id: string;
  name: string;
  title: string;
  text: string;
  rating: number;
  imageUrl?: string;
  createdAt: string;
}

interface SortOption {
  value: 'newest' | 'oldest';
  label: string;
}

const sortOptions: SortOption[] = [
  { value: 'newest', label: 'الأحدث أولاً' },
  { value: 'oldest', label: 'الأقدم أولاً' }
];

export default function TestimonialsManagement() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    text: '',
    rating: 5,
    imageUrl: ''
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  
  const router = useRouter();
  const db = getDatabase();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/admin/login');
      } else {
        loadTestimonials();
      }
    });

    return () => unsubscribe();
  }, [router, loadTestimonials]);

  const loadTestimonials = () => {
    const testimonialsRef = ref(db, 'testimonials');
    onValue(testimonialsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const testimonialsArray = Object.entries(data).map(([id, testimonial]: [string, any]) => ({
          id,
          ...testimonial
        }));
        setTestimonials(testimonialsArray.reverse());
      } else {
        setTestimonials([]);
      }
      setLoading(false);
    });
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDeleteClick = (testimonialId: string) => {
    setTestimonialToDelete(testimonialId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (testimonialToDelete) {
      try {
        await remove(ref(db, `testimonials/${testimonialToDelete}`));
        showNotification('تم حذف التقييم بنجاح', 'success');
        setShowDeleteConfirm(false);
        setTestimonialToDelete(null);
      } catch (error) {
        showNotification('حدث خطأ أثناء حذف التقييم', 'error');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const testimonialData = {
        ...formData,
        createdAt: editingTestimonial?.createdAt || new Date().toISOString()
      };

      if (editingTestimonial) {
        await set(ref(db, `testimonials/${editingTestimonial.id}`), testimonialData);
        showNotification('تم تحديث التقييم بنجاح', 'success');
      } else {
        await push(ref(db, 'testimonials'), testimonialData);
        showNotification('تم إضافة التقييم بنجاح', 'success');
      }

      setIsModalOpen(false);
      setEditingTestimonial(null);
      setFormData({ name: '', title: '', text: '', rating: 5, imageUrl: '' });
    } catch (error) {
      showNotification('حدث خطأ أثناء حفظ التقييم', 'error');
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      title: testimonial.title,
      text: testimonial.text,
      rating: testimonial.rating,
      imageUrl: testimonial.imageUrl || ''
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    try {
      const imageUrl = await uploadImageToFirebase(file);
      setFormData(prev => ({ ...prev, imageUrl }));
    } catch (error) {
      setUploadError('فشل رفع الصورة. يمكنك إضافة رابط الصورة مباشرة.');
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  const sortedTestimonials = useMemo(() => {
    return [...testimonials].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [testimonials, sortBy]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <AdminLayout>
      <div className="testimonials-management">
        <div className="page-header">
          <div className="header-content">
            <h1>إدارة التقييمات</h1>
            <div className="header-actions">
              <select 
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button 
                className="add-btn"
                onClick={() => {
                  setEditingTestimonial(null);
                  setFormData({ name: '', title: '', text: '', rating: 5, imageUrl: '' });
                  setIsModalOpen(true);
                }}
              >
                <FontAwesomeIcon icon={faPlus} />
                <span>إضافة تقييم جديد</span>
              </button>
            </div>
          </div>
        </div>

        <div className="testimonials-grid">
          {sortedTestimonials.map(testimonial => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="testimonial-header">
                <div className="user-info">
                  {testimonial.imageUrl ? (
                    <Image
                      src={testimonial.imageUrl}
                      alt={testimonial.name}
                      width={40}
                      height={40}
                      className="user-avatar"
                    />
                  ) : (
                    <div className="avatar-placeholder">
                      {testimonial.name[0]}
                    </div>
                  )}
                  <div className="testimonial-info">
                    <h3>{testimonial.name}</h3>
                    <span className="job-title">{testimonial.title}</span>
                    <div className="rating">
                      {[...Array(5)].map((_, index) => (
                        <FontAwesomeIcon
                          key={index}
                          icon={index < testimonial.rating ? faStarSolid : faStarRegular}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="testimonial-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => handleEdit(testimonial)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteClick(testimonial.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
              <p className="testimonial-text">{testimonial.text}</p>
              <time>{new Date(testimonial.createdAt).toLocaleDateString('en-US')}</time>
            </div>
          ))}
        </div>

        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h2>{editingTestimonial ? 'تعديل التقييم' : 'إضافة تقييم جديد'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="name-title-row">
                  <div className="form-group">
                    <label>اسم العميل</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>المسمى الوظيفي</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="مثال: مدير شركة، صاحب مطعم، الخ"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>نص التقييم</label>
                  <textarea
                    value={formData.text}
                    onChange={(e) => setFormData({...formData, text: e.target.value})}
                    required
                    placeholder="اكتب نص التقييم هنا..."
                  />
                </div>

                <div className="form-group">
                  <label>التقييم</label>
                  <div className="rating-input">
                    {[5,4,3,2,1].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({...formData, rating: star})}
                        className={star <= formData.rating ? 'active' : ''}
                      >
                        <FontAwesomeIcon icon={star <= formData.rating ? faStarSolid : faStarRegular} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>صورة العميل (اختياري)</label>
                  <div className="upload-container">
                    <div className="upload-methods">
                      <div className="upload-method">
                        <h4>رفع صورة</h4>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          ref={fileInputRef}
                          className="file-input"
                        />
                        <button 
                          type="button"
                          className="upload-btn"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}
                        >
                          {uploading ? (
                            <>
                              <FontAwesomeIcon icon={faSpinner} spin />
                              جاري الرفع...
                            </>
                          ) : (
                            <>
                              <FontAwesomeIcon icon={faUpload} />
                              اختر صورة
                            </>
                          )}
                        </button>
                      </div>

                      <div className="upload-method-divider">
                        <span>أو</span>
                      </div>

                      <div className="upload-method">
                        <h4>إضافة رابط</h4>
                        <input
                          type="url"
                          value={formData.imageUrl}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, imageUrl: e.target.value }));
                            setUploadError(null);
                          }}
                          placeholder="https://example.com/image.jpg"
                          className="url-input"
                        />
                      </div>
                    </div>

                    {formData.imageUrl && (
                      <div className="image-preview">
                        <Image
                          src={formData.imageUrl}
                          alt="معاينة"
                          width={100}
                          height={100}
                          className="preview-img rounded-full"
                          onError={() => {
                            setUploadError('رابط الصورة غير صالح');
                            setFormData(prev => ({ ...prev, imageUrl: '' }));
                          }}
                        />
                      </div>
                    )}
                    
                    {uploadError && (
                      <p className="upload-error">{uploadError}</p>
                    )}
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="submit" className="save-btn">
                    {editingTestimonial ? 'حفظ التعديلات' : 'إضافة التقييم'}
                  </button>
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => setIsModalOpen(false)}
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <ConfirmDialog
          isOpen={showDeleteConfirm}
          title="تأكيد الحذف"
          message="هل أنت متأكد من حذف هذا التقييم؟ لا يمكن التراجع عن هذا الإجراء."
          confirmText="نعم، احذف التقييم"
          cancelText="إلغاء"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDeleteConfirm(false)}
          type="delete"
        />

        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
      </div>
    </AdminLayout>
  );
} 