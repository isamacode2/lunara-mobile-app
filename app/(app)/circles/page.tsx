
"use client"

import { Moon, Users, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function CirclesPage() {
  const circles = [
    { name: "Full Moon Gathering", members: 124, type: "Community" },
    { name: "Crescent Conversations", members: 42, type: "Interest" },
    { name: "New Moon Intentions", members: 89, type: "Spiritual" },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="mb-10 text-center md:text-left">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
          <Moon className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-secondary">Circles</h1>
        <p className="text-muted-foreground mt-2">Join communities that resonate with your phase of life.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {circles.map((circle, i) => (
          <Card key={i} className="rounded-3xl border-none shadow-sm hover:shadow-md transition-all cursor-pointer bg-white overflow-hidden group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-primary/5 rounded-xl group-hover:bg-primary/10 transition-colors">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{circle.type}</span>
              </div>
              <h3 className="font-bold text-secondary text-lg mb-1">{circle.name}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {circle.members} souls nearby
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 p-8 bg-secondary/5 rounded-[2rem] text-center border border-secondary/10">
        <h3 className="text-lg font-bold text-secondary mb-2">Create your own Circle</h3>
        <p className="text-sm text-muted-foreground mb-6">Start a local gathering based on shared interests or values.</p>
        <button className="bg-secondary text-white px-8 py-3 rounded-full font-bold hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20">
          Propose a Circle
        </button>
      </div>
    </div>
  );
}
