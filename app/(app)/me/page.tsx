
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Camera, Mic, ChevronRight, LogOut, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUser, useFirestore, useDoc, useMemoFirebase, useAuth } from '@/firebase';
import { doc } from 'firebase/firestore';
import { signOut as firebaseSignOut } from 'firebase/auth';

export default function ProfilePage() {
  const { user, isUserLoading: isAuthLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const userProfileRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    // Corrected 4-segment path: users/{userId}/profile/private
    return doc(firestore, 'users', user.uid, 'profile', 'private');
  }, [firestore, user]);

  const { data: profile, isLoading: isProfileLoading } = useDoc(userProfileRef);

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth);
      router.push('/');
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  // Hydration Guard
  if (!mounted) return null;

  if (isAuthLoading || isProfileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F3F0F5]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-primary/20 rounded-full" />
          <span className="text-sm text-muted-foreground font-medium">Loading profile...</span>
        </div>
      </div>
    );
  }

  const profileImageUrl = profile?.profilePictureId === 'default' 
    ? `https://picsum.photos/seed/${user?.uid || 'default'}/300/300`
    : (user?.photoURL || `https://picsum.photos/seed/${user?.uid || 'default'}/300/300`);

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen pb-24 shadow-sm">
      <div className="pt-12 pb-8 flex flex-col items-center text-center px-6">
        <div className="relative mb-6">
          <div className="w-32 h-32 rounded-full border-4 border-[#F3F0F5] overflow-hidden relative shadow-lg bg-muted">
            <Image 
              src={profileImageUrl} 
              alt="Profile" 
              fill 
              className="object-cover" 
              data-ai-hint="person portrait"
            />
          </div>
          <button className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow-md border border-border hover:bg-muted transition-colors">
            <Camera className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <h1 className="text-3xl font-bold text-secondary">
            {profile?.displayName || user?.displayName || 'Soul Searcher'}
          </h1>
          <CheckCircle2 className="w-5 h-5 text-primary" />
        </div>

        <Badge variant="outline" className="rounded-full font-bold text-primary border-primary/20 mb-6 px-4 py-1 bg-primary/5">
          {profile?.age || '??'} · {profile?.gender || 'Soul'}
        </Badge>
        
        <p className="text-muted-foreground text-sm mb-8 leading-relaxed max-w-[280px]">
          {profile?.bio || 'Tell the world who you are...'}
        </p>

        <div className="flex flex-col gap-3 w-full mb-8">
          <Button variant="outline" className="w-full rounded-full border-primary text-primary hover:bg-primary/5 h-12 font-bold shadow-sm">
            Edit Profile
          </Button>
          <Button variant="outline" className="w-full rounded-full border-green-500 text-green-600 hover:bg-green-50 h-12 font-bold gap-2 shadow-sm">
            <Mic className="w-4 h-4" />
            Add Voice Intro
          </Button>
        </div>
      </div>

      <div className="px-6 py-6 border-t border-border">
        <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-6">Account Settings</h3>
        <div className="space-y-1">
          <SettingItem label="Privacy settings" />
          <SettingItem label="Safety & blocked users" />
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center justify-between py-5 group border-b border-border/50 last:border-0"
          >
            <span className="text-destructive font-bold">Sign out</span>
            <LogOut className="w-5 h-5 text-destructive group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}

function SettingItem({ label }: { label: string }) {
  return (
    <button className="w-full flex items-center justify-between py-5 border-b border-border/50 last:border-0 group">
      <span className="text-secondary font-bold text-sm">{label}</span>
      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
    </button>
  );
}
