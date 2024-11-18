import { Metadata } from 'next';
import BlogPostPage from '@/components/blog/BlogPostPage';
import { getBlogPosts } from '@/lib/blogger';

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({
    id: post.id,
  }));
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