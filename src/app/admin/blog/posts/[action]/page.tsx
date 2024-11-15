'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSave, 
  faSpinner, 
  faUpload,
  faEye,
  faArrowLeft,
  faGlobe,
  faLock
} from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import { uploadImage, createBlogPost, updateBlogPost, getBlogPost } from '@/lib/strapi';
import Notification from '@/components/admin/Notification';
import { StrapiData, BlogPost } from '@/types/strapi';

interface PostForm {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  status: 'draft' | 'published';
  tags: string[];
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}

const initialFormState: PostForm = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  featuredImage: '',
  category: '',
  status: 'draft',
  tags: [],
  seo: {
    metaTitle: '',
    metaDescription: '',
    keywords: []
  }
};

export default function PostEditor() {
  const [form, setForm] = useState<PostForm>(initialFormState);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const params = useParams();
  const isEdit = params.action === 'edit';

  const loadPost = useCallback(async () => {
    try {
      const response = await getBlogPost(params.id as string);
      const post = response.data.attributes;
      setForm({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        featuredImage: post.featuredImage?.data?.attributes?.url || '',
        category: post.category?.data?.attributes?.slug || '',
        status: post.status,
        tags: post.seo?.keywords || [],
        seo: {
          metaTitle: post.seo?.metaTitle || '',
          metaDescription: post.seo?.metaDescription || '',
          keywords: post.seo?.keywords || []
        }
      });
    } catch (error) {
      showNotification('فشل تحميل المقال', 'error');
    }
  }, [params.id]);

  useEffect(() => {
    if (isEdit) {
      loadPost();
    }
  }, [isEdit, loadPost]);

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSave = async () => {
    setLoading(true);

    try {
      const postData: Partial<BlogPost> = {
        title: form.title,
        slug: form.slug || form.title.toLowerCase().replace(/\s+/g, '-'),
        excerpt: form.excerpt,
        content: form.content,
        status: form.status,
        featuredImage: form.featuredImage ? {
          data: {
            id: 1,
            attributes: {
              url: form.featuredImage,
              width: 0,
              height: 0,
              formats: {
                thumbnail: {
                  url: form.featuredImage
                }
              }
            }
          }
        } : null,
        category: form.category ? {
          data: {
            id: 1,
            attributes: {
              name: '',
              slug: form.category
            }
          }
        } : null,
        seo: {
          metaTitle: form.seo.metaTitle || form.title,
          metaDescription: form.seo.metaDescription || form.excerpt,
          keywords: form.tags
        },
        publishedAt: form.status === 'published' ? new Date().toISOString() : null
      };

      if (isEdit) {
        await updateBlogPost(params.id as string, postData);
      } else {
        await createBlogPost(postData);
      }

      setIsDirty(false);
      showNotification(
        isEdit ? 'تم تحديث المقال بنجاح' : 'تم إنشاء المقال بنجاح',
        'success'
      );
      router.push('/admin/blog/posts');
    } catch (error) {
      console.error('Error saving post:', error);
      showNotification('حدث خطأ أثناء حفظ المقال', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    try {
      const imageUrl = await uploadImage(file);
      setForm(prev => ({ ...prev, featuredImage: imageUrl }));
      setIsDirty(true);
    } catch (error) {
      setUploadError('فشل رفع الصورة. الرجاء المحاولة مرة أخرى.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="post-editor">
        <div className="page-header">
          <div className="header-content">
            <button 
              className="back-btn"
              onClick={() => router.push('/admin/blog/posts')}
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              <span>العودة للمقالات</span>
            </button>
            <h1>{isEdit ? 'تحرير المقال' : 'مقال جديد'}</h1>
          </div>

          <div className="header-actions">
            <button
              className="preview-btn"
              onClick={() => setIsPreview(!isPreview)}
            >
              <FontAwesomeIcon icon={faEye} />
              <span>{isPreview ? 'العودة للتحرير' : 'معاينة'}</span>
            </button>

            <button
              className="save-btn"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin />
                  <span>جاري الحفظ...</span>
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faSave} />
                  <span>حفظ المقال</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="editor-container">
          <div className="editor-main">
            <div className="form-group">
              <label>عنوان المقال</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => {
                  setForm({ ...form, title: e.target.value });
                  setIsDirty(true);
                }}
                placeholder="أدخل عنوان المقال..."
                maxLength={100}
                required
              />
              <span className="char-count">{form.title.length}/100</span>
            </div>

            <div className="form-group">
              <label>مقدمة المقال</label>
              <textarea
                value={form.excerpt}
                onChange={(e) => {
                  setForm({ ...form, excerpt: e.target.value });
                  setIsDirty(true);
                }}
                placeholder="اكتب مقدمة مختصرة للمقال..."
                maxLength={200}
                rows={3}
                required
              />
              <span className="char-count">{form.excerpt.length}/200</span>
            </div>

            <div className="form-group">
              <label>محتوى المقال</label>
              {isPreview ? (
                <div className="preview-content" 
                  dangerouslySetInnerHTML={{ __html: form.content }} 
                />
              ) : (
                <textarea
                  value={form.content}
                  onChange={(e) => {
                    setForm({ ...form, content: e.target.value });
                    setIsDirty(true);
                  }}
                  placeholder="اكتب محتوى المقال..."
                  className="content-editor"
                  rows={20}
                  required
                />
              )}
            </div>
          </div>

          <div className="editor-sidebar">
            {/* باقي الكود للـ sidebar يبقى كما هو */}
          </div>
        </div>

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