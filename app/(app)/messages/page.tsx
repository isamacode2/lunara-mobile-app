
"use client"

import Link from 'next/link';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { MOCK_PROFILES } from '@/lib/mock-data';

export default function MessagesListPage() {
  const activeChats = MOCK_PROFILES.slice(0, 2);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-secondary mb-6">Messages</h1>
      
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search matches..." className="pl-10 rounded-full border-border bg-white" />
      </div>

      <div className="space-y-2">
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">New Matches</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {MOCK_PROFILES.slice(2, 4).map(profile => (
            <Link key={profile.id} href={`/chat/${profile.id}`} className="flex flex-col items-center gap-1 shrink-0">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary p-0.5">
                <Image src={profile.imageUrl} alt={profile.name} width={64} height={64} className="rounded-full object-cover aspect-square" />
              </div>
              <span className="text-xs font-medium text-secondary">{profile.name}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="space-y-4 mt-8">
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Recent Chats</h2>
        {activeChats.map(chat => (
          <Link 
            key={chat.id} 
            href={`/chat/${chat.id}`}
            className="flex items-center gap-4 p-4 bg-white rounded-3xl border border-border hover:shadow-md transition-all"
          >
            <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0">
              <Image src={chat.imageUrl} alt={chat.name} fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-bold text-secondary">{chat.name}</h3>
                <span className="text-[10px] text-muted-foreground">2:35 PM</span>
              </div>
              <p className="text-sm text-muted-foreground truncate">Hey there! I saw you like photography too?</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
