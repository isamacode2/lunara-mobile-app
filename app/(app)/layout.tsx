
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { BottomNav } from '@/components/BottomNav';
import { SidebarNav } from '@/components/SidebarNav';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Hydration Guard
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router, mounted]);

  // Don't render anything until mounted to prevent hydration errors
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F3F0F5]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-primary/20 rounded-full" />
          <span className="text-sm text-muted-foreground font-medium">Initializing...</span>
        </div>
      </div>
    );
  }

  // Show loading state if auth is still checking
  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F3F0F5]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-primary/20 rounded-full" />
          <span className="text-sm text-muted-foreground font-medium">Syncing profile...</span>
        </div>
      </div>
    );
  }

  // If no user, the second useEffect will handle the redirect
  if (!user) {
    return null; 
  }

  return (
    <div className="flex min-h-screen">
      <SidebarNav />
      <main className="flex-1 pb-20 md:pb-0 md:pl-64">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
