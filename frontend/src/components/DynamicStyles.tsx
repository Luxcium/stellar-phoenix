'use client';

import { useEffect, useState } from 'react';

export default function DynamicStyles() {
  // Use state to ensure consistent rendering
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only run after component mounts to avoid hydration mismatch
    setMounted(true);

    // Apply any dynamic styles to body through className instead of style prop
    document.body.classList.add('dynamic-styles');

    return () => {
      document.body.classList.remove('dynamic-styles');
    };
  }, []);

  // Don't render anything that could cause hydration mismatch
  if (!mounted) return null;

  return null;
}
