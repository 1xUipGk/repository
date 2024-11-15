'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faEdit, 
  faTrash, 
  faEye, 
  faSpinner,
  faFilter,
  faSearch
} from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import { getBlogPosts, deleteBlogPost } from '@/lib/strapi';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import Notification from '@/components/admin/Notification';
import { StrapiData, BlogPost } from '@/types/strapi';

export default function BlogPosts() {
  const [posts, setPosts] = useState<StrapiData<BlogPost>[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const router = useRouter();

  const loadPosts = useCallback(async () => {
    try {
      const filters: Record<string, any> = {};
      
      if (selectedStatus !== 'all') {
        filters['filters[status][$eq]'] = selectedStatus;
      }
      
      if (selectedCategory !== 'all') {
        filters['filters[category][slug][$eq]'] = selectedCategory;
      }
      
      if (searchQuery) {
        filters['filters[$or][0][title][$containsi]'] = searchQuery;
        filters['filters[$or][1][content][$containsi]'] = searchQuery;
      }

      const response = await getBlogPosts(1, 10, filters);
      setPosts(response.data);
    } catch (error) {
      console.error('Error loading posts:', error);
      showNotification('حدث خطأ أثناء تحميل المقالات', 'error');
    } finally {
      setLoading(false);
    }
  }, [selectedStatus, selectedCategory, searchQuery]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDeleteClick = (postId: string) => {
    setPostToDelete(postId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (postToDelete) {
      try {
        await deleteBlogPost(postToDelete);
        showNotification('تم حذف المقال بنجاح', 'success');
        setShowDeleteConfirm(false);
        setPostToDelete(null);
        loadPosts();
      } catch (error) {
        showNotification('حدث خطأ أثناء حذف المقال', 'error');
      }
    }
  };

  return (
    <AdminLayout>
      <div className="admin-blog">
        <div className="page-header">
          <div className="header-content">
            <h1>إدارة المقالات</h1>
            <div className="header-actions">
              <div className="search-box">
                <FontAwesomeIcon icon={faSearch} className="search-icon" />
                <input
                  type="text"
                  placeholder="بحث في المقالات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="filters">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="published">منشور</option>
                  <option value="draft">مسودة</option>
                </select>
              </div>

              <button 
                className="add-btn"
                onClick={() => router.push('/admin/blog/posts/new')}
              >
                <FontAwesomeIcon icon={faPlus} />
                <span>مقال جديد</span>
              </button>
            </div>
          </div>
        </div>

        <div className="posts-grid">
          {loading ? (
            <div className="loading-posts">
              <FontAwesomeIcon icon={faSpinner} spin />
              <span>جاري التحميل...</span>
            </div>
          ) : posts.length === 0 ? (
            <div className="no-posts">
              <p>لا توجد مقالات</p>
              <button 
                className="add-btn"
                onClick={() => router.push('/admin/blog/posts/new')}
              >
                <FontAwesomeIcon icon={faPlus} />
                <span>إضافة مقال جديد</span>
              </button>
            </div>
          ) : (
            posts.map(post => (
              <div key={post.id} className="post-card">
                <div className="post-image">
                  {post.attributes.featuredImage?.data && (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${post.attributes.featuredImage.data.attributes.url}`}
                      alt={post.attributes.title}
                      width={300}
                      height={200}
                      className="post-thumbnail"
                    />
                  )}
                  <div className="post-overlay">
                    <div className="post-actions">
                      <button 
                        className="action-btn edit-btn"
                        onClick={() => router.push(`/admin/blog/posts/${post.id}/edit`)}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button 
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteClick(post.id.toString())}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="post-info">
                  <h3>{post.attributes.title}</h3>
                  <p className="post-excerpt">{post.attributes.excerpt}</p>
                  <div className="post-meta">
                    <span className={`post-status ${post.attributes.status}`}>
                      {post.attributes.status === 'published' ? 'منشور' : 'مسودة'}
                    </span>
                    {post.attributes.category?.data && (
                      <span className="post-category">
                        {post.attributes.category.data.attributes.name}
                      </span>
                    )}
                    <time className="post-date">
                      {new Date(post.attributes.createdAt).toLocaleDateString('ar-SA')}
                    </time>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <ConfirmDialog
          isOpen={showDeleteConfirm}
          title="تأكيد الحذف"
          message="هل أنت متأكد من حذف هذا المقال؟ لا يمكن التراجع عن هذا الإجراء."
          confirmText="نعم، احذف المقال"
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