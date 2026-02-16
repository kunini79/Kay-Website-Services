// EncartaKids Daily Highlights Service

export interface DailyHighlight {
  date: string;
  funFact: string;
  featuredTopic: string;
  onThisDay: string;
  challenge: string;
}

// Fun facts database
const FUN_FACTS = [
  "🦕 Dinosaurs lived on Earth for about 165 million years!",
  "🌍 The Earth is about 4.5 billion years old!",
  "🐋 A blue whale's heart is as big as a small car!",
  "🌟 There are more stars in the universe than grains of sand on all Earth's beaches!",
  "🐜 Ants can lift 50 times their own body weight!",
  "🦋 Butterflies taste with their feet!",
  "🌈 A rainbow actually forms a complete circle, but we only see half!",
  "🧠 Your brain uses 20% of your body's energy!",
  "🦒 Giraffes only sleep for 10-30 minutes per day!",
  "🌊 The ocean is home to 80% of all life on Earth!",
  "🎨 Leonardo da Vinci could write with one hand and draw with the other at the same time!",
  "📚 The world's oldest library is over 4,000 years old!",
  "🚀 It takes 8 minutes for sunlight to reach Earth!",
  "🐙 Octopuses have three hearts and blue blood!",
  "🌺 Some bamboo plants can grow 3 feet in just 24 hours!",
  "🦉 Owls can't move their eyeballs in their sockets!",
  "🐝 Bees can recognize human faces!",
  "🌙 The Moon is moving away from Earth at about 1.5 inches per year!",
  "🎵 Music can help plants grow faster!",
  "🦖 Some dinosaurs had feathers, just like modern birds!",
];

// Featured topics by category
const FEATURED_TOPICS = {
  Monday: ["Space Exploration", "The Solar System", "Black Holes"],
  Tuesday: ["Ancient Egypt", "Vikings", "The Roman Empire"],
  Wednesday: ["Ocean Animals", "Rainforests", "Endangered Species"],
  Thursday: ["Volcanoes", "Weather Patterns", "The Water Cycle"],
  Friday: ["Famous Scientists", "Inventors", "World Leaders"],
  Saturday: ["Sports Heroes", "The Olympics", "Team Sports"],
  Sunday: ["Art History", "Music", "Creative Writing"],
};

// On This Day events (simplified - could be expanded with real historical data)
const ON_THIS_DAY_EVENTS = [
  "In 1969, humans first landed on the Moon! 🚀",
  "In 1776, the United States declared independence! 🗽",
  "In 1903, the Wright brothers achieved the first powered flight! ✈️",
  "In 1928, Alexander Fleming discovered penicillin! 💊",
  "In 1989, the Berlin Wall came down! 🏛️",
  "In 1969, the first internet message was sent! 💻",
  "In 1859, Charles Darwin published 'On the Origin of Species'! 🐒",
  "In 1455, Johannes Gutenberg printed the first book! 📖",
  "In 1876, Alexander Graham Bell invented the telephone! ☎️",
  "In 1879, Thomas Edison invented the light bulb! 💡",
];

// Daily challenges
const DAILY_CHALLENGES = [
  "Find three things in your house that are made from trees! 🌳",
  "Draw a picture of your favorite animal and label its body parts! 🎨",
  "Count how many different languages you hear today! 🗣️",
  "Look up at the sky and identify 3 different cloud types! ☁️",
  "Ask a family member about their favorite childhood memory! 👨‍👩‍👧",
  "Create a timeline of your day from morning to night! ⏰",
  "Find 5 objects that start with the same letter! 🔤",
  "Measure something using only your hands and feet! 📏",
  "Write a short story using exactly 50 words! ✍️",
  "Build something using only items from recycling! ♻️",
  "Learn how to say 'hello' in three different languages! 🌍",
  "Find shapes in nature (circles, triangles, squares)! 🔺",
  "Count backwards from 100 by 7s! 🔢",
  "Create a new dance move and name it! 💃",
  "Look for patterns in your clothes, walls, or furniture! 🎨",
];

// Get daily highlight based on current date
export function getDailyHighlight(): DailyHighlight {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
  
  // Use day of year to select consistent content for each day
  const funFact = FUN_FACTS[dayOfYear % FUN_FACTS.length];
  const topics = FEATURED_TOPICS[dayName as keyof typeof FEATURED_TOPICS];
  const featuredTopic = topics[Math.floor(dayOfYear / 7) % topics.length];
  const onThisDay = ON_THIS_DAY_EVENTS[dayOfYear % ON_THIS_DAY_EVENTS.length];
  const challenge = DAILY_CHALLENGES[dayOfYear % DAILY_CHALLENGES.length];
  
  return {
    date: today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    funFact,
    featuredTopic,
    onThisDay,
    challenge,
  };
}

// Track which daily highlights have been viewed
export function markHighlightViewed(date: string): void {
  if (typeof window === 'undefined') return;
  
  const viewed = JSON.parse(localStorage.getItem('encartakids_viewed_highlights') || '[]');
  if (!viewed.includes(date)) {
    viewed.push(date);
    // Keep only last 30 days
    if (viewed.length > 30) {
      viewed.splice(0, viewed.length - 30);
    }
    localStorage.setItem('encartakids_viewed_highlights', JSON.stringify(viewed));
  }
}

// Check if today's highlight has been viewed
export function isTodayHighlightViewed(): boolean {
  if (typeof window === 'undefined') return false;
  
  const today = new Date().toDateString();
  const viewed = JSON.parse(localStorage.getItem('encartakids_viewed_highlights') || '[]');
  return viewed.includes(today);
}

// Search history management
export interface SearchHistoryItem {
  query: string;
  timestamp: Date;
  category?: string;
}

export function addToSearchHistory(query: string, category?: string): void {
  if (typeof window === 'undefined') return;
  
  const history: SearchHistoryItem[] = JSON.parse(localStorage.getItem('encartakids_search_history') || '[]');
  
  // Don't add duplicates that are very recent (within last hour)
  const oneHourAgo = new Date(Date.now() - 3600000);
  const recentDuplicate = history.find(
    item => item.query.toLowerCase() === query.toLowerCase() && 
           new Date(item.timestamp) > oneHourAgo
  );
  
  if (!recentDuplicate) {
    history.unshift({
      query,
      timestamp: new Date(),
      category,
    });
    
    // Keep only last 50 searches
    if (history.length > 50) {
      history.splice(50);
    }
    
    localStorage.setItem('encartakids_search_history', JSON.stringify(history));
  }
}

export function getSearchHistory(limit: number = 10): SearchHistoryItem[] {
  if (typeof window === 'undefined') return [];
  
  const history = JSON.parse(localStorage.getItem('encartakids_search_history') || '[]');
  return history.slice(0, limit).map((item: any) => ({
    ...item,
    timestamp: new Date(item.timestamp),
  }));
}

export function clearSearchHistory(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('encartakids_search_history');
}

// Get smart suggestions based on search history
export function getSmartSuggestions(limit: number = 5): string[] {
  const history = getSearchHistory(20);
  
  // Count frequency of each search
  const frequency: Record<string, number> = {};
  history.forEach(item => {
    const normalized = item.query.toLowerCase();
    frequency[normalized] = (frequency[normalized] || 0) + 1;
  });
  
  // Sort by frequency and get top suggestions
  const suggestions = Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([query]) => query);
  
  return suggestions;
}

// Get trending topics (based on what users are searching)
export function getTrendingTopics(limit: number = 5): string[] {
  // In a real app, this would come from a backend
  // For now, return popular educational topics
  const trending = [
    "Dinosaurs",
    "Space",
    "Ancient Egypt",
    "Ocean Life",
    "Climate Change",
    "Robots",
    "Black Holes",
    "Rain forests",
  ];
  
  return trending.slice(0, limit);
}
