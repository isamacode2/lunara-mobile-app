
export interface User {
  id: string;
  name: string;
  age: number;
  bio: string;
  interests: string[];
  imageUrl: string;
  distance: string;
  hasVoiceIntro?: boolean;
}

export const MOCK_PROFILES: User[] = [
  {
    id: '1',
    name: 'Sarah',
    age: 24,
    bio: 'Avid traveler and coffee enthusiast. Looking for someone to explore hidden gems in the city with! I value authenticity and deep conversations.',
    interests: ['Travel', 'Photography', 'Coffee'],
    imageUrl: 'https://picsum.photos/seed/user1/600/800',
    distance: '2 miles away',
    hasVoiceIntro: true
  },
  {
    id: '2',
    name: 'Marcus',
    age: 28,
    bio: 'Software engineer by day, amateur chef by night. Let\'s cook something amazing together. I love experimenting with fusion cuisines.',
    interests: ['Cooking', 'Coding', 'Gaming'],
    imageUrl: 'https://picsum.photos/seed/user2/600/800',
    distance: '5 miles away',
    hasVoiceIntro: true
  },
  {
    id: 'nova',
    name: 'Nova',
    age: 27,
    bio: 'Solo poly woman navigating ENM with intention. I value autonomy and emotional intelligence above all.',
    interests: ['Travel', 'ENM', 'Coffee'],
    imageUrl: 'https://picsum.photos/seed/nova/600/800', 
    distance: '2 miles away',
    hasVoiceIntro: true
  },
  {
    id: '3',
    name: 'Elena',
    age: 26,
    bio: 'Yoga lover and plant mom. Seeking someone who appreciates the little things in life and enjoys morning hikes.',
    interests: ['Yoga', 'Plants', 'Hiking'],
    imageUrl: 'https://picsum.photos/seed/user3/600/800',
    distance: '1 mile away',
    hasVoiceIntro: false
  },
  {
    id: '4',
    name: 'James',
    age: 30,
    bio: 'Live music and outdoor adventures. Always up for a spontaneous road trip or a concert night!',
    interests: ['Music', 'Hiking', 'Photography'],
    imageUrl: 'https://picsum.photos/seed/user4/600/800',
    distance: '8 miles away',
    hasVoiceIntro: true
  }
];

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export const MOCK_CHATS: Record<string, Message[]> = {
  '1': [
    { id: 'm1', senderId: '1', text: 'Hey there! I saw you like photography too?', timestamp: '2:30 PM' },
    { id: 'm2', senderId: 'me', text: 'Yes! I just got a new film camera.', timestamp: '2:35 PM' }
  ]
};
