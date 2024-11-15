const IMGUR_CLIENT_ID = process.env.NEXT_PUBLIC_IMGUR_CLIENT_ID;
const IMGUR_CLIENT_SECRET = process.env.NEXT_PUBLIC_IMGUR_CLIENT_SECRET;
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// تحويل الملف إلى base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export const uploadImage = async (file: File): Promise<string> => {
  // التحقق من حجم ونوع الملف
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('حجم الصورة يجب أن يكون أقل من 10 ميجابايت');
  }

  if (!file.type.startsWith('image/')) {
    throw new Error('يرجى اختيار ملف صورة صالح');
  }

  let attempts = 0;
  let lastError: Error | null = null;

  while (attempts < MAX_RETRIES) {
    try {
      // تحويل الملف إلى base64
      const base64Image = await fileToBase64(file);
      
      const response = await fetch('https://api.imgur.com/3/image', {
        method: 'POST',
        headers: {
          'Authorization': `Client-ID ${IMGUR_CLIENT_ID}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          image: base64Image.split(',')[1],
          type: 'base64'
        })
      });

      if (response.status === 429) {
        attempts++;
        if (attempts === MAX_RETRIES) {
          throw new Error('تم تجاوز الحد الأقصى للمحاولات. يرجى المحاولة بعد دقيقة');
        }
        await sleep(RETRY_DELAY * Math.pow(2, attempts));
        continue;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.data?.error || 'فشل رفع الصورة');
      }

      const data = await response.json();
      if (!data.success || !data.data?.link) {
        throw new Error('لم يتم استلام رابط الصورة');
      }

      return data.data.link;
    } catch (error) {
      lastError = error as Error;
      if (attempts === MAX_RETRIES - 1) {
        console.error('Error uploading image:', error);
        throw new Error(lastError?.message || 'فشل رفع الصورة');
      }
      attempts++;
      await sleep(RETRY_DELAY * Math.pow(2, attempts));
    }
  }

  throw new Error(lastError?.message || 'فشل رفع الصورة بعد عدة محاولات');
}; 