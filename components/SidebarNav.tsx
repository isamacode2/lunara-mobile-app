
"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Compass, MessageCircle, Moon, ShieldAlert, User, LogOut, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';

export function SidebarNav() {
  const pathname = usePathname();
  const auth = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { href: '/discover', icon: Compass, label: 'Discover' },
    { href: '/chat', icon: MessageCircle, label: 'Chat' },
    { href: '/circles', icon: Moon, label: 'Circles' },
    { href: '/safety', icon: ShieldAlert, label: 'Safety' },
    { href: '/me', icon: User, label: 'Profile' },
  ];

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  if (!mounted) return null;

  return (
    <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-border flex-col p-6 z-50 shadow-sm">
      <div className="flex items-center gap-2 mb-10 px-2">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
          <Heart className="w-4 h-4 text-white fill-current" />
        </div>
        <span className="text-xl font-bold text-secondary tracking-tight">Lunara</span>
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/discover' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all",
                isActive 
                  ? "bg-primary/10 text-primary shadow-sm shadow-primary/5" 
                  : "text-muted-foreground hover:bg-[#F9FAFB] hover:text-secondary"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive && "fill-primary/10")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <Button 
        variant="ghost" 
        onClick={handleSignOut}
        className="justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/5 rounded-2xl px-4 mt-auto font-bold"
      >
        <LogOut className="w-5 h-5" />
        Sign Out
      </Button>
    </aside>
  );
}
