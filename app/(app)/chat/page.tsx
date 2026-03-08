
"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, MessageSquareX } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useCollection, useMemoFirebase, useFirestore, useUser } from '@/firebase';
import { collection } from 'firebase/firestore';

export default function ChatListPage() {
  const firestore = useFirestore();
  const { user } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const publicProfilesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'public_profiles');
  }, [firestore]);

  const { data: profiles, isLoading } = useCollection(publicProfilesQuery);

  if (!mounted) {
    return <div className="p-10 text-center">Loading connections...</div>;
  }

  if (isLoading) return <div className="p-10 text-center">Loading chats...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-secondary mb-6">Messages</h1>
      
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search matches..." className="pl-10 rounded-full border-border bg-white h-12" />
      </div>

      <div className="space-y-2">
        <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">New Connections</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {profiles && profiles.length > 0 ? (
            profiles.filter(p => p.id !== user?.uid).map(profile => (
              <Link key={profile.id} href={`/chat/${profile.id}`} className="flex flex-col items-center gap-2 shrink-0">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary p-0.5">
                  <Image 
                    src={`https://picsum.photos/seed/${profile.id}/100/100`} 
                    alt={profile.displayName} 
                    width={64} 
                    height={64} 
                    className="rounded-full object-cover aspect-square" 
                  />
                </div>
                <span className="text-xs font-medium text-secondary">{profile.displayName}</span>
              </Link>
            ))
          ) : (
            <p className="text-xs text-muted-foreground">Keep discovering to find matches!</p>
          )}
        </div>
      </div>

      <div className="space-y-4 mt-8">
        <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Recent Chats</h2>
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border border-dashed border-border">
          <MessageSquareX className="w-10 h-10 text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground">No recent conversations yet.</p>
        </div>
      </div>
    </div>
  );
}
