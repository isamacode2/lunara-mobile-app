
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LegacyGroupRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/me');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen bg-[#F3F0F5]">
      <p className="text-muted-foreground animate-pulse font-bold">Redirecting to profile...</p>
    </div>
  );
}
