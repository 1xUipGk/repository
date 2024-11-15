'use client';
import { useState, useEffect } from 'react';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  published: boolean;
}

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  return (
    <div className="admin-container">
      <h1 className="text-2xl font-bold mb-6">إدارة المدونة</h1>
      
      <div className="mb-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          إضافة مقال جديد
        </button>
      </div>

      <div className="posts-grid">
        {posts.map((post) => (
          <div key={post.id} className="post-card p-4 border rounded">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <div className="flex justify-between mt-4">
              <span>{new Date(post.createdAt).toLocaleDateString('ar-SA')}</span>
              <span className={post.published ? 'text-green-500' : 'text-red-500'}>
                {post.published ? 'منشور' : 'مسودة'}
              </span>
            </div>
            <div className="mt-4 space-x-2 rtl:space-x-reverse">
              <button className="bg-yellow-500 text-white px-3 py-1 rounded">تعديل</button>
              <button className="bg-red-500 text-white px-3 py-1 rounded">حذف</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 