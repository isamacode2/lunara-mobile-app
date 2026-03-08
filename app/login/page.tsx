'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth, useUser } from '@/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInAnonymously } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const router = useRouter();
  const auth = useAuth();
  const { user } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && user) {
      router.replace('/onboarding');
    }
  }, [user, mounted, router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mounted || isLoading) return;
    
    setIsLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        toast({
          title: 'Welcome back!',
          description: 'Taking you to your orbit.',
        });
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        toast({
          title: 'Account Created!',
          description: 'Welcome to Lunara. Let\'s set up your profile.',
        });
      }
    } catch (error: any) {
      console.error("Auth Error:", error);
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: error.message || 'An unexpected error occurred.',
      });
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    if (!mounted || isLoading) return;
    setIsLoading(true);
    try {
      await signInAnonymously(auth);
      toast({
        title: 'Joined as Guest',
        description: 'Exploring the platform as a soul searcher.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F3F0F5]">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3F0F5] p-6">
      <Card className="w-full max-w-md rounded-[2.5rem] border-none shadow-xl overflow-hidden">
        <CardHeader className="pt-10 pb-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Heart className="w-6 h-6 text-white fill-current" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-secondary">
            {isLogin ? 'Welcome Back' : 'Join Lunara'}
          </CardTitle>
          <CardDescription>
            {isLogin ? 'Enter your details to continue your search.' : 'Start your journey towards meaningful connection.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@example.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-full h-12 border-border focus-visible:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-full h-12 border-border focus-visible:ring-primary/20"
              />
            </div>
            <Button type="submit" className="w-full rounded-full h-12 bg-secondary hover:bg-secondary/90 font-bold" disabled={isLoading}>
              {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </Button>
          </form>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          
          <Button variant="outline" className="w-full rounded-full h-12 border-primary text-primary hover:bg-primary/5 font-bold" onClick={handleGuestLogin} disabled={isLoading}>
            Try as Guest
          </Button>
        </CardContent>
        <CardFooter className="pb-10 pt-2 flex justify-center">
          <button 
            type="button" 
            onClick={() => {
              setIsLogin(!isLogin);
              setIsLoading(false);
            }}
            className="text-sm font-medium text-primary hover:underline"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </CardFooter>
      </Card>
    </div>
  );
}
