'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="error-container">
      <h2>حدث خطأ ما</h2>
      <button
        onClick={() => reset()}
        className="retry-btn"
      >
        حاول مرة أخرى
      </button>
    </div>
  );
} 