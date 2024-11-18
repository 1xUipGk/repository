const IMGUR_CLIENT_ID = process.env.NEXT_PUBLIC_IMGUR_CLIENT_ID;

export async function uploadToImgur(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch('https://api.imgur.com/3/image', {
      method: 'POST',
      headers: {
        'Authorization': `Client-ID ${IMGUR_CLIENT_ID}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to upload image to Imgur');
    }

    const data = await response.json();
    return data.data.link;
  } catch (error) {
    console.error('Error uploading to Imgur:', error);
    throw error;
  }
}

export async function uploadImage(file: File): Promise<string> {
  return uploadToImgur(file);
} 