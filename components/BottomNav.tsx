
"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, MessageCircle, Moon, ShieldAlert, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const navItems = [
    { href: '/discover', icon: Compass, label: 'Discover' },
    { href: '/chat', icon: MessageCircle, label: 'Chat' },
    { href: '/circles', icon: Moon, label: 'Circles' },
    { href: '/safety', icon: ShieldAlert, label: 'Safety' },
    { href: '/me', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border px-4 py-3 flex justify-between items-center z-50 md:hidden">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/discover' && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 transition-colors min-w-[64px]",
              isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
            )}
          >
            <div className={cn(
              "p-1.5 rounded-full transition-colors",
              isActive && "bg-primary/10"
            )}>
              <item.icon className={cn("w-6 h-6", isActive && "fill-primary/20")} />
            </div>
            <span className="text-[10px] font-bold">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
