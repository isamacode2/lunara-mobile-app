
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles, ShieldCheck, Mic } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F3F0F5]">
      {/* Navbar */}
      <header className="px-6 py-4 flex justify-between items-center bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-sm">
            <Heart className="w-5 h-5 text-white fill-current" />
          </div>
          <span className="text-xl font-bold text-secondary tracking-tight">Lunara</span>
        </div>
        <Link href="/login">
          <Button variant="secondary" className="rounded-full px-6 font-bold">Launch App</Button>
        </Link>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 text-center py-20 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <Image 
            src="https://picsum.photos/seed/lunara-hero/1200/800"
            alt="Lunara Atmosphere"
            fill
            className="object-cover"
            priority
          />
        </div>
        
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-6">
            <Sparkles className="w-3 h-3" />
            The Future of Connection
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-secondary mb-6 leading-tight">
            Find the <span className="text-primary italic">Soul</span> that matches yours.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Experience a dating app designed for intentionality. No public profiles. No mindless swiping. Just genuine presence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="rounded-full px-10 h-14 text-lg bg-secondary hover:bg-secondary/90 shadow-xl shadow-secondary/20 font-bold transition-all active:scale-95">
                Join Lunara
              </Button>
            </Link>
            <Link href="/safety">
              <Button size="lg" variant="outline" className="rounded-full px-10 h-14 text-lg border-primary text-primary hover:bg-primary/5 font-bold">
                Our Standard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center text-center p-8 bg-[#F3F0F5] rounded-[2.5rem] transition-transform hover:-translate-y-1">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-6">
              <Mic className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-secondary mb-3">Voice Intros</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">Hear the soul behind the screen. Authenticity starts with the human voice.</p>
          </div>
          <div className="flex flex-col items-center text-center p-8 bg-[#F3F0F5] rounded-[2.5rem] transition-transform hover:-translate-y-1">
            <div className="w-16 h-16 rounded-2xl bg-secondary/20 flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-2xl font-bold text-secondary mb-3">Intentional Connecting</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">Mandatory intent declaration ensures every conversation starts with a shared "Why."</p>
          </div>
          <div className="flex flex-col items-center text-center p-8 bg-[#F3F0F5] rounded-[2.5rem] transition-transform hover:-translate-y-1">
            <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center mb-6">
              <ShieldCheck className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-secondary mb-3">Lunara Safety</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">Strict privacy measures. No public profiles. No data selling. Ever.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-white text-center">
        <div className="flex items-center justify-center gap-2 mb-4 opacity-50">
          <Heart className="w-4 h-4 text-primary fill-current" />
          <span className="font-bold text-secondary">Lunara</span>
        </div>
        <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">&copy; 2024 Lunara. Built with Intention.</p>
      </footer>
    </div>
  );
}
