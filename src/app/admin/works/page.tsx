'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, onValue, remove, push, set, get } from 'firebase/database';
import { auth } from '@/lib/firebase';
import AdminLayout from '@/components/admin/AdminLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faEdit, 
  faTrash, 
  faSpinner, 
  faArchive, 
  faUpload, 
  faEye 
} from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import { uploadImage } from '@/lib/imgur';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import Notification from '@/components/admin/Notification';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Work {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  views?: number;
  createdAt: string;
}

const categories = [
  { id: 'social-media', title: 'بوستات سوشيال ميديا' },
  { id: 'print', title: 'الفلايرات والبروشورات' },
  { id: 'roll-up', title: 'رول أب ولافتات' },
  { id: 'menu', title: 'قوائم الطعام' },
  { id: 'business-cards', title: 'البطاقات الشخصية' },
  { id: 'book-covers', title: 'أغلفة الكتب' },
  { id: 'invitations', title: 'بطاقات دعوة' },
  { id: 'certificates', title: 'الشهادات التقديرية' },
  { id: 'advertising', title: 'اللوحات الإعلانية' }
];

export default function WorksManagement() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWork, setEditingWork] = useState<Work | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    imageUrl: ''
  });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const router = useRouter();
  const db = getDatabase();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [workToDelete, setWorkToDelete] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/admin/login');
      } else {
        loadWorks();
      }
    });

    return () => unsubscribe();
  }, [router]);

  const loadWorks = () => {
    const worksRef = ref(db, 'works');
    onValue(worksRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const worksArray = Object.entries(data).map(([id, work]: [string, any]) => ({
          id,
          ...work
        }));
        setWorks(worksArray.reverse());
      }
      setLoading(false);
    });
  };

  const handleDeleteClick = (workId: string) => {
    setWorkToDelete(workId);
    setShowDeleteConfirm(true);
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDeleteConfirm = async () => {
    if (workToDelete) {
      try {
        await remove(ref(db, `works/${workToDelete}`));
        showNotification('تم حذف العمل بنجاح', 'success');
        setShowDeleteConfirm(false);
        setWorkToDelete(null);
      } catch (error) {
        showNotification('حدث خطأ أثناء حذف العمل', 'error');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const workData = {
        ...formData,
        createdAt: new Date().toISOString()
      };

      if (editingWork) {
        await set(ref(db, `works/${editingWork.id}`), workData);
      } else {
        await push(ref(db, 'works'), workData);
      }

      setIsModalOpen(false);
      setEditingWork(null);
      setFormData({ title: '', category: '', imageUrl: '' });
    } catch (error) {
      console.error('Error saving work:', error);
    }
  };

  const handleEdit = (work: Work) => {
    setEditingWork(work);
    setFormData({
      title: work.title,
      category: work.category,
      imageUrl: work.imageUrl
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    try {
      const imageUrl = await uploadImage(file);
      setFormData(prev => ({ ...prev, imageUrl }));
    } catch (error) {
      setUploadError('فشل رفع الصورة. الرجاء المحاولة مرة أخرى.');
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleArchive = async (workId: string) => {
    try {
      const workRef = ref(db, `works/${workId}`);
      const workSnapshot = await get(workRef);
      const workData = workSnapshot.val();

      if (workData) {
        await push(ref(db, 'archived_works'), {
          ...workData,
          archivedAt: new Date().toISOString()
        });
        await remove(workRef);
        showNotification('تم أرشفة العمل بنجاح', 'success');
      }
    } catch (error) {
      showNotification('حدث خطأ أثناء أرشفة العمل', 'error');
    }
  };

  const filteredWorks = selectedCategory === 'all' 
    ? works 
    : works.filter(work => work.category === selectedCategory);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <AdminLayout>
      <div className="works-management">
        <div className="page-header">
          <h1>إدارة الأعمال</h1>
          <button 
            className="add-btn"
            onClick={() => {
              setEditingWork(null);
              setFormData({ title: '', category: '', imageUrl: '' });
              setIsModalOpen(true);
            }}
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>إضافة عمل جديد</span>
          </button>
        </div>

        <div className="filters">
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-filter"
          >
            <option value="all">جميع الأقسام</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.title}
              </option>
            ))}
          </select>
        </div>

        <div className="works-grid">
          {filteredWorks.map(work => (
            <div key={work.id} className="work-card">
              <div className="work-image-container">
                <Image
                  src={work.imageUrl}
                  alt={work.title}
                  width={300}
                  height={200}
                  className="work-thumbnail"
                />
                <div className="work-overlay">
                  <div className="work-views">
                    <FontAwesomeIcon icon={faEye} />
                    <span>{work.views || 0}</span>
                  </div>
                  <div className="work-actions">
                    <button 
                      className="action-btn edit-btn"
                      onClick={() => handleEdit(work)}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button 
                      className="action-btn delete-btn"
                      onClick={() => handleDeleteClick(work.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="work-info">
                <h3>{work.title}</h3>
                <span className="work-category">
                  {categories.find(c => c.id === work.category)?.title}
                </span>
                <time className="work-date">
                  {new Date(work.createdAt).toLocaleDateString('ar-SA')}
                </time>
              </div>
            </div>
          ))}
        </div>

        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h2>{editingWork ? 'تعديل العمل' : 'إضافة عمل جديد'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>عنوان العمل</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    maxLength={50}
                    required
                  />
                  <span className="char-count">{formData.title.length}/50</span>
                </div>

                <div className="form-group">
                  <label>القسم</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    required
                  >
                    <option value="">اختر القسم</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>الصورة</label>
                  <div className="upload-container">
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
                    {formData.imageUrl && (
                      <div className="image-preview">
                        <Image
                          src={formData.imageUrl}
                          alt="معاينة"
                          width={100}
                          height={100}
                          className="preview-img"
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
                    {editingWork ? 'حفظ التعديلات' : 'إضافة العمل'}
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
          message="هل أنت متأكد من حذف هذا العمل؟ لا يمكن التراجع عن هذا الإجراء."
          confirmText="نعم، احذف العمل"
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