'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Send, Sparkles, Mic, Phone, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDoc, useMemoFirebase, useFirestore, useUser } from '@/firebase';
import { doc } from 'firebase/firestore';
import { generateConversationStarters } from '@/ai/flows/ai-conversation-starter';
import { cn } from '@/lib/utils';

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const firestore = useFirestore();
  const { user } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const partnerProfileRef = useMemoFirebase(() => {
    if (!firestore || !resolvedParams.id) return null;
    return doc(firestore, 'public_profiles', resolvedParams.id);
  }, [firestore, resolvedParams.id]);

  const { data: match, isLoading: isMatchLoading } = useDoc(partnerProfileRef);

  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [showAI, setShowAI] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  // Hydration Guard
  if (!mounted) return null;

  const handleSendMessage = () => {
    if (!inputValue.trim() || !user) return;
    
    const newMessage = {
      id: Date.now().toString(),
      senderId: user.uid,
      text: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
  };

  const loadIcebreakers = async () => {
    if (!match || !user) return;
    setIsLoadingAI(true);
    setShowAI(true);
    try {
      const result = await generateConversationStarters({
        currentUserProfile: {
          name: user.displayName || 'Me',
          bio: 'Looking for connection.',
          interests: []
        },
        matchedUserProfile: {
          name: match.displayName,
          bio: match.bio,
          interests: match.interests
        },
        sharedInterests: match.interests?.filter((i: string) => [].includes(i as never)) || []
      });
      setAiSuggestions(result.suggestions);
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setIsLoadingAI(false);
    }
  };

  if (isMatchLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F3F0F5]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-10 h-10 bg-primary/20 rounded-full" />
          <span className="text-sm text-muted-foreground">Opening chat...</span>
        </div>
      </div>
    );
  }

  if (!match) return <div className="p-10 text-center">Match not found.</div>;

  return (
    <div className="h-screen flex flex-col bg-[#F3F0F5]">
      <header className="bg-white p-4 border-b border-border flex items-center justify-between shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link href="/chat">
            <Button variant="ghost" size="icon" className="md:hidden">
              <ChevronLeft className="w-6 h-6" />
            </Button>
          </Link>
          <div className="relative w-10 h-10 rounded-full overflow-hidden">
            <Image 
              src={`https://picsum.photos/seed/${match.id}/100/100`} 
              alt={match.displayName} 
              fill 
              className="object-cover" 
            />
          </div>
          <div>
            <h2 className="font-bold text-secondary leading-none">{match.displayName}</h2>
            <span className="text-[10px] text-green-500 font-medium">Online</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon"><Phone className="w-4 h-4" /></Button>
          <Button variant="ghost" size="icon"><Video className="w-4 h-4" /></Button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {messages.length === 0 && (
          <div className="text-center py-10 text-muted-foreground text-sm">
            No messages yet. Start the conversation!
          </div>
        )}
        {messages.map((msg) => (
          <div 
            key={msg.id}
            className={cn(
              "max-w-[80%] p-3 rounded-2xl text-sm relative",
              msg.senderId === user?.uid 
                ? "bg-secondary text-white self-end rounded-tr-none" 
                : "bg-white text-secondary self-start rounded-tl-none shadow-sm"
            )}
          >
            {msg.text}
            <span className={cn(
              "text-[9px] absolute -bottom-4",
              msg.senderId === user?.uid ? "right-0 text-muted-foreground" : "left-0 text-muted-foreground"
            )}>
              {msg.timestamp}
            </span>
          </div>
        ))}
      </div>

      {showAI && (
        <div className="bg-white border-t border-primary/20 p-4 animate-in slide-in-from-bottom-full duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              AI Icebreakers
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowAI(false)}>Close</Button>
          </div>
          {isLoadingAI ? (
            <div className="flex gap-2 animate-pulse">
              <div className="h-8 w-24 bg-muted rounded-full" />
              <div className="h-8 w-32 bg-muted rounded-full" />
            </div>
          ) : (
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {aiSuggestions.map((s, i) => (
                <Button 
                  key={i} 
                  variant="outline" 
                  size="sm" 
                  className="rounded-full whitespace-nowrap border-primary/30 text-xs hover:bg-primary/5"
                  onClick={() => {
                    setInputValue(s);
                    setShowAI(false);
                  }}
                >
                  {s}
                </Button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="p-4 bg-white border-t border-border">
        <div className="flex items-center gap-2">
          {!showAI && (
            <Button 
              size="icon" 
              variant="outline" 
              className="rounded-full border-primary/30 text-primary shrink-0"
              onClick={loadIcebreakers}
            >
              <Sparkles className="w-5 h-5" />
            </Button>
          )}
          <Input 
            placeholder="Type a message..." 
            className="rounded-full border-none bg-[#F3F0F5] focus-visible:ring-1 ring-primary/20"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          {inputValue ? (
            <Button 
              size="icon" 
              className="rounded-full bg-secondary hover:bg-secondary/90 shrink-0"
              onClick={handleSendMessage}
            >
              <Send className="w-4 h-4" />
            </Button>
          ) : (
            <Button size="icon" variant="ghost" className="rounded-full text-muted-foreground">
              <Mic className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}