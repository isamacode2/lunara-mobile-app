
import Link from 'next/link';
import Image from 'next/image';
import { MOCK_PROFILES } from '@/lib/mock-data';
import { Card, CardContent } from '@/components/ui/card';
import { Heart } from 'lucide-react';

export default function MatchesPage() {
  const matches = MOCK_PROFILES.slice(0, 3); // Simulated matches

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="mb-10 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
          <Heart className="w-6 h-6 text-primary fill-current" />
        </div>
        <h1 className="text-3xl font-bold text-secondary">Your Matches</h1>
        <p className="text-muted-foreground mt-2">You have {matches.length} mutual connections!</p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {matches.map((match) => (
          <Link key={match.id} href={`/chat/${match.id}`}>
            <Card className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all rounded-3xl">
              <CardContent className="p-0 relative aspect-[3/4]">
                <Image 
                  src={match.imageUrl}
                  alt={match.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <p className="font-bold text-lg">{match.name}, {match.age}</p>
                  <p className="text-xs text-white/80">Matched 2 days ago</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {matches.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted-foreground">Keep swiping to find your matches!</p>
        </div>
      )}
    </div>
  );
}
