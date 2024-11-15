import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'المدونة',
  description: 'اقرأ أحدث المقالات في مدونتنا',
};

export default function BlogPage() {
  return (
    <div className="blog-container">
      <h1 className="text-4xl font-bold text-center mb-8">المدونة</h1>
      
      <div className="blog-grid">
        {/* سيتم إضافة المقالات هنا لاحقاً */}
        <div className="blog-post">
          <div className="blog-post-image">
            <img src="/images/placeholder.jpg" alt="صورة المقال" />
          </div>
          <div className="blog-post-content">
            <h2 className="text-2xl font-semibold">عنوان المقال</h2>
            <p className="text-gray-600 mt-2">
              هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة...
            </p>
            <div className="mt-4">
              <button className="text-blue-500 hover:text-blue-700">
                اقرأ المزيد
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}