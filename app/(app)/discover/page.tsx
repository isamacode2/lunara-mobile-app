
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { SearchX, Play, Pause, Info, RefreshCw, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useCollection, useMemoFirebase, useFirestore, useUser } from '@/firebase';
import { collection } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';

export default function DiscoverPage() {
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
  const [activeProfileIndex, setActiveProfileIndex] = useState(0);
  const [connectReason, setConnectReason] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);

  // Hydration Guard
  if (!mounted) return null;

  if (isLoading) {
    return (
      <div className="h-screen bg-[#F3F0F5] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const filteredProfiles = profiles?.filter(p => p.id !== user?.uid) || [];
  const activeProfile = filteredProfiles && filteredProfiles.length > 0 && activeProfileIndex !== -1 && activeProfileIndex < filteredProfiles.length
    ? filteredProfiles[activeProfileIndex] 
    : null;

  const handleNext = () => {
    setIsPlayingVoice(false);
    if (filteredProfiles && activeProfileIndex < filteredProfiles.length - 1) {
      setActiveProfileIndex(activeProfileIndex + 1);
    } else {
      setActiveProfileIndex(-1);
    }
    setConnectReason('');
  };

  const handleConnect = () => {
    if (!user || !activeProfile || !firestore) return;

    const interactionRef = collection(firestore, 'users', user.uid, 'interactions');
    addDocumentNonBlocking(interactionRef, {
      swiperId: user.uid,
      swipedProfileId: activeProfile.id,
      interactionType: 'like',
      reason: connectReason,
      interactionAt: new Date().toISOString()
    });

    setIsDialogOpen(false);
    handleNext();
  };

  if (!activeProfile) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center min-h-[80vh] bg-[#F3F0F5]">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <SearchX className="w-10 h-10 text-primary/40" />
        </div>
        <h2 className="text-2xl font-bold text-secondary mb-2">You're the First Soul Here!</h2>
        <p className="text-muted-foreground mb-8 max-w-xs mx-auto">
          Welcome to the community. As the platform grows, more profiles will appear here. Invite friends to join your orbit!
        </p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
           <Button 
            className="rounded-full gap-2 bg-secondary"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="w-4 h-4" />
            Check for New Profiles
          </Button>
          <Button 
            variant="outline" 
            className="rounded-full gap-2 border-primary text-primary"
          >
            <UserPlus className="w-4 h-4" />
            Invite a Friend
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F0F5] pb-24">
      <header className="px-6 py-8 flex justify-between items-center bg-transparent max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-[#1A1A1A]">Discover</h1>
        <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center border border-border">
          <Info className="w-5 h-5 text-muted-foreground" />
        </div>
      </header>

      <div className="px-4 max-w-2xl mx-auto">
        <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-border/50">
          <div className="relative aspect-[4/5] w-full bg-[#F3F3F3]">
            <Image 
              src={`https://picsum.photos/seed/${activeProfile.id}/600/800`}
              alt={activeProfile.displayName || 'Profile'}
              fill
              className="object-cover"
              priority
              data-ai-hint="person portrait"
            />

            <button 
              onClick={() => setIsPlayingVoice(!isPlayingVoice)}
              className="absolute bottom-6 right-6 flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white hover:bg-white transition-all group"
            >
              <div className={cn(
                "w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white",
                isPlayingVoice && "animate-pulse"
              )}>
                {isPlayingVoice ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </div>
              <span className="text-xs font-bold text-secondary pr-1">Hear Voice Intro</span>
            </button>
          </div>

          <div className="p-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-bold text-[#1A1A1A]">{activeProfile.displayName}, {activeProfile.age}</h2>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {activeProfile.interests?.map((interest: string) => (
                <Badge key={interest} variant="secondary" className="rounded-full px-3 py-1 bg-[#F3F0F5] border-transparent text-muted-foreground font-medium">
                  {interest}
                </Badge>
              ))}
            </div>

            <div className="space-y-2 mb-8">
              <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                <span>Compatibility Boost</span>
                <span className="text-primary">+15%</span>
              </div>
              <Progress value={45} className="h-1.5 bg-[#F3F0F5]" />
            </div>

            <p className="text-[#4B5563] text-base leading-relaxed mb-10">
              {activeProfile.bio}
            </p>

            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                size="lg" 
                className="h-16 rounded-3xl border-[#E5E7EB] text-[#4B5563] font-bold text-lg hover:bg-gray-50 transition-all active:scale-95"
                onClick={handleNext}
              >
                Pass
              </Button>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    size="lg" 
                    className="h-16 rounded-3xl bg-secondary hover:bg-secondary/90 text-white font-bold text-lg shadow-lg shadow-secondary/20 transition-all active:scale-95"
                  >
                    Connect
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-[2.5rem] sm:rounded-[2.5rem] max-w-[95vw] sm:max-w-md p-8">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-secondary mb-2 text-left">Connect with {activeProfile.displayName}</DialogTitle>
                    <DialogDescription className="text-muted-foreground text-left text-sm leading-relaxed">
                      "Intent declaration before connecting. Shared with the other person." — The Lunara Standard
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-6">
                    <Textarea 
                      placeholder="Share what caught your eye about their profile..." 
                      className="min-h-[140px] rounded-2xl resize-none border-border focus-visible:ring-primary/20 bg-[#F9FAFB] p-4 text-sm"
                      value={connectReason}
                      onChange={(e) => setConnectReason(e.target.value)}
                    />
                    <p className="text-[10px] text-muted-foreground mt-3 text-center">
                      Quality intentions lead to better conversations.
                    </p>
                  </div>
                  <DialogFooter className="flex-col sm:flex-row gap-3">
                    <Button 
                      variant="ghost" 
                      onClick={() => setIsDialogOpen(false)}
                      className="rounded-full order-2 sm:order-1 font-bold h-12"
                    >
                      Maybe later
                    </Button>
                    <Button 
                      onClick={handleConnect}
                      disabled={!connectReason.trim()}
                      className="rounded-full bg-secondary hover:bg-secondary/90 px-10 order-1 sm:order-2 font-bold h-12"
                    >
                      Send Request
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
