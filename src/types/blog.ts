export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  imageUrl: string;
  createdAt: string;
  views: number;
  isUpdated: boolean;
  category?: string;
  readingTime?: string;
} 