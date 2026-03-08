'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, subYears, isBefore } from 'date-fns';
import { Calendar as CalendarIcon, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateAIBio } from '@/ai/flows/ai-bio-generator';

export default function OnboardingPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const [displayName, setDisplayName] = useState('');
  const [birthDate, setBirthDate] = useState<Date>();
  const [bio, setBio] = useState('');
  const [gender, setGender] = useState('');
  const [interests, setInterests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const profileRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid, 'profile', 'private');
  }, [firestore, user]);

  const { data: existingProfile, isLoading: isCheckingProfile } = useDoc(profileRef);

  useEffect(() => {
    if (mounted && !isUserLoading && !user) {
      router.replace('/login');
    }
  }, [user, isUserLoading, router, mounted]);

  useEffect(() => {
    if (mounted && existingProfile) {
      router.replace('/discover');
    }
  }, [existingProfile, router, mounted]);

  const calculateAge = (date: Date) => {
    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();
    const m = today.getMonth() - date.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
      age--;
    }
    return age;
  };

  const isOldEnough = (date: Date) => {
    const eighteenYearsAgo = subYears(new Date(), 18);
    return isBefore(date, eighteenYearsAgo);
  };

  const handleAIBio = async () => {
    if (!interests) {
      toast({
        title: "Interests needed",
        description: "Add some interests first so the AI knows what to write about!",
      });
      return;
    }
    setIsGeneratingBio(true);
    try {
      const result = await generateAIBio({
        keywords: ['authentic', 'intentional', 'warm'],
        interests: interests.split(',').map(i => i.trim()),
        bioLength: 'medium'
      });
      setBio(result.generatedBio);
      toast({
        title: "Bio Generated!",
        description: "Your AI-powered bio is ready for review.",
      });
    } catch (error) {
      console.error("AI Error:", error);
      toast({
        variant: 'destructive',
        title: "AI Help Failed",
        description: "We couldn't generate a bio right now. Please try again.",
      });
    } finally {
      setIsGeneratingBio(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !firestore || !mounted || isSubmitting) return;

    if (!birthDate) {
      toast({ variant: 'destructive', title: 'Missing Birth Date', description: 'Please select your birth date.' });
      return;
    }

    if (!isOldEnough(birthDate)) {
      toast({ variant: 'destructive', title: 'Age Restriction', description: 'You must be at least 18 to join Lunara.' });
      return;
    }

    if (!gender) {
      toast({ variant: 'destructive', title: 'Missing Gender', description: 'Please select your gender identity.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const profileData = {
        id: user.uid,
        displayName,
        age: calculateAge(birthDate),
        birthDate: birthDate.toISOString(),
        bio,
        gender,
        latitude: 0,
        longitude: 0,
        interests: interests.split(',').map(i => i.trim()).filter(i => i !== ''),
        profilePictureId: 'default',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Set private profile
      await setDoc(doc(firestore, 'users', user.uid, 'profile', 'private'), profileData);
      
      // Set public profile for discovery
      await setDoc(doc(firestore, 'public_profiles', user.uid), {
        id: profileData.id,
        displayName: profileData.displayName,
        age: profileData.age,
        bio: profileData.bio,
        gender: profileData.gender,
        interests: profileData.interests,
        latitude: profileData.latitude,
        longitude: profileData.longitude,
        profilePictureId: profileData.profilePictureId,
        updatedAt: profileData.updatedAt
      });

      toast({ title: 'Profile Created!', description: 'Welcome to the Lunara community.' });
      router.replace('/discover');
    } catch (error: any) {
      console.error("Onboarding Save Error:", error);
      toast({ variant: 'destructive', title: 'Error saving profile', description: error.message });
      setIsSubmitting(false);
    }
  };

  if (!mounted || isUserLoading || isCheckingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F3F0F5]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-primary/20 rounded-full" />
          <span className="text-sm text-muted-foreground font-medium">Preparing Lunara...</span>
        </div>
      </div>
    );
  }

  const genderOptions = ["Woman", "Man", "Non-binary", "Agender", "Pangender", "Genderqueer", "Two-Spirit", "Prefer not to say"];

  return (
    <div className="min-h-screen bg-[#F3F0F5] p-6 flex items-center justify-center">
      <Card className="w-full max-w-2xl rounded-[2.5rem] border-none shadow-xl overflow-hidden">
        <CardHeader className="pt-10 pb-6">
          <CardTitle className="text-3xl font-bold text-secondary">Complete Your Profile</CardTitle>
          <CardDescription>Tell us a bit about yourself to start making meaningful connections.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input 
                id="displayName" 
                required 
                placeholder="What should we call you?"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="rounded-full h-12 border-border focus-visible:ring-primary/20"
              />
            </div>
            
            <div className="space-y-2 flex flex-col">
              <Label htmlFor="age">Birth Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full h-12 rounded-full justify-start text-left font-normal border-border",
                      !birthDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {birthDate ? format(birthDate, "PPP") : <span>Pick your birthday</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={birthDate}
                    onSelect={setBirthDate}
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    initialFocus
                    fromYear={1900}
                    toYear={new Date().getFullYear()}
                    captionLayout="dropdown-buttons"
                  />
                </PopoverContent>
              </Popover>
              {birthDate && (
                <span className={cn(
                  "text-[10px] ml-4 mt-1 font-bold",
                  isOldEnough(birthDate) ? "text-green-600" : "text-destructive"
                )}>
                  Age: {calculateAge(birthDate)} {!isOldEnough(birthDate) && "(Must be 18+)"}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender Identity</Label>
              <Select onValueChange={setGender} value={gender}>
                <SelectTrigger className="w-full h-12 rounded-full border-border focus:ring-primary/20">
                  <SelectValue placeholder="How do you identify?" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  {genderOptions.map((option) => (
                    <SelectItem key={option} value={option} className="rounded-xl">{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interests">Interests (comma separated)</Label>
              <Input 
                id="interests" 
                required 
                placeholder="Travel, Art, Music" 
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                className="rounded-full h-12 border-border focus-visible:ring-primary/20"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="bio">Your Story</Label>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  className="text-primary text-xs gap-1 font-bold"
                  onClick={handleAIBio}
                  disabled={isGeneratingBio}
                >
                  <Sparkles className="w-3 h-3" />
                  {isGeneratingBio ? 'Writing...' : 'AI Bio Help'}
                </Button>
              </div>
              <Textarea 
                id="bio" 
                required 
                placeholder="Tell the community about your journey..." 
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="rounded-2xl min-h-[120px] border-border focus-visible:ring-primary/20"
              />
            </div>

            <div className="md:col-span-2 pt-4">
              <Button type="submit" className="w-full rounded-full h-14 text-lg bg-secondary hover:bg-secondary/90 font-bold" disabled={isSubmitting}>
                {isSubmitting ? 'Finalizing Profile...' : 'Start Making Connections'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
