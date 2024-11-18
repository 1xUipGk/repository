'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { convertToBlob, cleanupBlobUrl } from '@/lib/imageUtils';

interface BlogPostProps {
  post: {
    id: string;
    title: string;
    excerpt: string;
    imageUrl: string;
    views?: number;
  };
}

export default function BlogPost({ post }: BlogPostProps) {
  const [blobImageUrl, setBlobImageUrl] = useState<string>(post.imageUrl);

  useEffect(() => {
    async function convertImage() {
      const blobUrl = await convertToBlob(post.imageUrl);
      setBlobImageUrl(blobUrl);
    }
    convertImage();

    return () => {
      if (blobImageUrl) {
        cleanupBlobUrl(blobImageUrl);
      }
    };
  }, [post.imageUrl, blobImageUrl]);

  return (
    <Link href={`/blog/${post.id}`} className="perblog">
      <div 
        className="bg" 
        style={{ backgroundImage: `url(${blobImageUrl})` }}
      />
      <div className="blogtext">
        <div className="title">{post.title}</div>
        <div className="descr">{post.excerpt}</div>
        <div className="addinfo">
          <div className="readmore">قراءة المزيد</div>
          <div className="views">
            <FontAwesomeIcon icon={faEye} /> {post.views || 0}
          </div>
        </div>
      </div>
    </Link>
  );
} 