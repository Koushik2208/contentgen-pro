import { ContentCard, ContentType, ContentTone, ContentPillar } from '../types';

export const mockContent: ContentCard[] = [
  {
    id: '1',
    type: 'post' as ContentType,
    title: 'The Power of Authentic Leadership',
    content: 'Authentic leadership isn\'t about being perfect—it\'s about being real. Here\'s what I\'ve learned after 10 years in management:\n\n✅ Vulnerability builds trust\n✅ Admitting mistakes shows strength\n✅ Listening creates connection\n\nYour team doesn\'t need a superhero. They need a human who cares about their growth and success.\n\nWhat\'s one leadership lesson that changed your perspective?',
    tone: 'Professional' as ContentTone,
    pillar: 'Thought Leadership' as ContentPillar,
    engagement: { likes: 247, comments: 32, shares: 18 },
    createdAt: '2024-01-15',
    isFavorited: true,
    platform: ['LinkedIn', 'Twitter']
  },
  {
    id: '2',
    type: 'carousel' as ContentType,
    title: '5 Content Creation Mistakes to Avoid',
    content: 'Slide 1: Stop making these content mistakes that kill engagement\n\nSlide 2: Mistake #1 - Posting without a strategy\nSlide 3: Mistake #2 - Ignoring your audience\'s pain points\nSlide 4: Mistake #3 - Being too salesy too often\nSlide 5: Mistake #4 - Inconsistent posting schedule\nSlide 6: Mistake #5 - Not engaging with comments\n\nSlide 7: Ready to level up your content game?',
    tone: 'Educational' as ContentTone,
    pillar: 'Tips & Advice' as ContentPillar,
    engagement: { likes: 189, comments: 24, shares: 31 },
    createdAt: '2024-01-14',
    isFavorited: false,
    platform: ['Instagram', 'LinkedIn']
  },
  {
    id: '3',
    type: 'thread' as ContentType,
    title: 'My Journey from Employee to Entrepreneur',
    content: '🧵 Thread: How I went from corporate employee to successful entrepreneur in 18 months\n\n1/ It started with a simple realization: I was trading time for money, but I wanted to build something that could scale beyond my hours.\n\n2/ The first step wasn\'t quitting my job—it was developing a skill that people would pay for outside of my 9-5.\n\n3/ I spent 6 months learning digital marketing in the evenings and weekends. Every free moment was invested in my future self.',
    tone: 'Storytelling' as ContentTone,
    pillar: 'Personal Story' as ContentPillar,
    engagement: { likes: 156, comments: 19, shares: 12 },
    createdAt: '2024-01-13',
    isFavorited: true,
    platform: ['Twitter', 'LinkedIn']
  },
  {
    id: '4',
    type: 'post' as ContentType,
    title: 'The ROI of Personal Branding',
    content: 'Personal branding isn\'t vanity—it\'s strategy. Here\'s the ROI I\'ve seen from building my brand:\n\n📈 3x more inbound leads\n💰 40% higher consulting rates\n🤝 Access to exclusive opportunities\n🎯 Clearer ideal client attraction\n\nYour expertise is valuable. Your personal brand makes it visible.\n\nWhat\'s holding you back from sharing your knowledge?',
    tone: 'Professional' as ContentTone,
    pillar: 'Business Growth' as ContentPillar,
    engagement: { likes: 203, comments: 28, shares: 15 },
    createdAt: '2024-01-12',
    isFavorited: false,
    platform: ['LinkedIn']
  },
  {
    id: '5',
    type: 'post' as ContentType,
    title: 'Behind the Scenes: My Morning Routine',
    content: 'You asked about my morning routine, so here it is (the real, unfiltered version):\n\n5:30 AM - Wake up (sometimes 5:45 if I\'m honest)\n6:00 AM - Coffee + journal for 10 minutes\n6:15 AM - Quick workout or walk\n7:00 AM - Review priorities for the day\n7:30 AM - Deep work block (no emails/social)\n\nThe secret? It\'s not perfect, but it\'s consistent 80% of the time.\n\nWhat\'s one morning habit that changed your life?',
    tone: 'Casual' as ContentTone,
    pillar: 'Behind the Scenes' as ContentPillar,
    engagement: { likes: 134, comments: 41, shares: 8 },
    createdAt: '2024-01-11',
    isFavorited: true,
    platform: ['Instagram', 'LinkedIn']
  },
  {
    id: '6',
    type: 'carousel' as ContentType,
    title: 'Content Pillars That Convert',
    content: 'Slide 1: The 5 content pillars every personal brand needs\n\nSlide 2: Pillar 1 - Educational (Teach your expertise)\nSlide 3: Pillar 2 - Inspirational (Share your journey)\nSlide 4: Pillar 3 - Behind the Scenes (Show your process)\nSlide 5: Pillar 4 - Industry Insights (Share your perspective)\nSlide 6: Pillar 5 - Community (Engage your audience)\n\nSlide 7: Which pillar resonates most with your brand?',
    tone: 'Educational' as ContentTone,
    pillar: 'Tips & Advice' as ContentPillar,
    engagement: { likes: 278, comments: 35, shares: 22 },
    createdAt: '2024-01-10',
    isFavorited: false,
    platform: ['Instagram', 'LinkedIn']
  }
];
