import { StrapiResponse, StrapiData, BlogPost } from '@/types/strapi';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  console.log('STRAPI_URL:', STRAPI_URL);
  console.log('STRAPI_TOKEN:', STRAPI_TOKEN);
  
  if (!STRAPI_URL) {
    throw new Error('STRAPI_URL is not defined');
  }

  if (!STRAPI_TOKEN) {
    throw new Error('STRAPI_TOKEN is not defined');
  }

  const defaultOptions = {
    headers: {
      'Authorization': `Bearer ${STRAPI_TOKEN}`,
      'Content-Type': 'application/json',
    },
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${STRAPI_URL}/api/${endpoint}`, mergedOptions);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.error?.message || 
        `HTTP error! status: ${response.status}`
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Failed to fetch') || error.message.includes('Network request failed')) {
        throw new Error('Could not connect to Strapi server - Please check if Strapi is running');
      }
      throw error;
    }
    throw new Error('An unknown error occurred');
  }
}

export async function getBlogPosts(
  page = 1,
  pageSize = 10,
  filters: Record<string, any> = {}
): Promise<StrapiResponse<StrapiData<BlogPost>[]>> {
  const queryParams = new URLSearchParams({
    'pagination[page]': page.toString(),
    'pagination[pageSize]': pageSize.toString(),
    'populate': '*',
    ...filters,
  });

  try {
    return await fetchAPI(`articles?${queryParams}`);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw error;
  }
}

export async function getBlogPost(id: string): Promise<StrapiResponse<StrapiData<BlogPost>>> {
  return fetchAPI(`articles/${id}?populate=*`);
}

export async function createBlogPost(data: Partial<BlogPost>): Promise<StrapiResponse<StrapiData<BlogPost>>> {
  return fetchAPI('articles', {
    method: 'POST',
    body: JSON.stringify({ data }),
  });
}

export async function updateBlogPost(
  id: string,
  data: Partial<BlogPost>
): Promise<StrapiResponse<StrapiData<BlogPost>>> {
  return fetchAPI(`articles/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ data }),
  });
}

export async function deleteBlogPost(id: string): Promise<void> {
  await fetchAPI(`articles/${id}`, {
    method: 'DELETE',
  });
}

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('files', file);

  const response = await fetch(`${STRAPI_URL}/api/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${STRAPI_TOKEN}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload image');
  }

  const data = await response.json();
  return data[0].url;
} 