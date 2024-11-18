import { Metadata } from 'next';
import BlogPostPage from '@/components/blog/BlogPostPage';
import { getBlogPosts } from '@/lib/blogger';

export async function generateStaticParams() {
  try {
    const posts = await getBlogPosts();
    return posts.map((post) => ({
      id: post.id
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return []; // إرجاع مصفوفة فارغة في حالة الخطأ
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  return {
    title: 'المدونة - 3lismaeel',
    description: 'مقالات ومدونات علي إسماعيل',
  };
}

export default function BlogPost({ params }: { params: { id: string } }) {
  return <BlogPostPage postId={params.id} />;
} 