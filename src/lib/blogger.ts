import { BlogPost } from '@/types/blog';

const BLOG_ID = process.env.NEXT_PUBLIC_BLOG_ID;
const API_KEY = process.env.NEXT_PUBLIC_BLOGGER_API_KEY;

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetch(
      `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts?key=${API_KEY}`,
      { cache: 'no-store' }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }

    const data = await response.json();
    
    return data.items.map((post: any) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      excerpt: post.content.replace(/<[^>]+>/g, '').substring(0, 150) + '...',
      imageUrl: extractFirstImage(post.content),
      createdAt: post.published,
      views: 0,
      isUpdated: new Date(post.updated) > new Date(post.published),
      category: post.labels?.[0] || 'عام'
    }));
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export async function getBlogPost(id: string) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts/${id}?key=${API_KEY}`,
      { cache: 'no-store' }
    );

    if (!response.ok) {
      return null;
    }

    const post = await response.json();
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      published: post.published,
      imageUrl: extractFirstImage(post.content)
    };
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

function extractFirstImage(content: string): string {
  const match = content.match(/<img[^>]+src="([^">]+)"/);
  return match ? match[1] : '/images/blog/default.jpg';
} 