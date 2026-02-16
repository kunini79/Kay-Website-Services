# EncartaKids - Interactive Learning Platform

![EncartaKids](https://img.shields.io/badge/EncartaKids-Learning%20Made%20Fun-0066CC?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active%20Development-success?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-1.0-blue?style=for-the-badge)

**EncartaKids** is an AI-powered educational platform designed for children aged 8-14, combining the nostalgia of classic encyclopedias with modern interactive learning experiences.

---

## 🌟 Features

### Core Learning Features
- **📚 AI-Generated Articles**: Comprehensive, age-appropriate articles on any topic using Google Gemini AI
- **🎯 Interactive Quizzes**: Test knowledge with AI-generated quizzes after each article
- **🏆 Achievement System**: Earn badges, points, and track learning progress
- **🔖 Bookmarks**: Save favorite articles for later reading
- **🗣️ Read Aloud**: Text-to-speech functionality for accessibility
- **🖨️ Print Friendly**: Print articles for offline study

### Gamification
- **🌟 Badges**: 10+ achievement badges to unlock
  - First Steps, Bookworm, Super Reader
  - Quiz Champion, Quiz Starter
  - Week Warrior (7-day streak)
  - World Explorer (read all categories)
- **📊 Progress Tracking**: 
  - Articles read counter
  - Quiz performance analytics
  - Learning streak tracker
  - Points and level system
- **🎖️ Levels**: Advance through levels by earning points

### Daily Engagement
- **💡 Daily Fun Facts**: New interesting fact every day
- **🎯 Featured Topics**: Curated topic of the day
- **📅 On This Day**: Historical events
- **🎨 Daily Challenges**: Fun activities to complete

### Smart Navigation
- **🔍 Search History**: Track and revisit recent searches
- **🎲 Surprise Me**: Random topic discovery
- **🔗 Related Topics**: Explore connected subjects
- **📂 10 Categories**: Animals, Science, Sports, Arts, Reading, People, Places, History, Social Studies, Games

---

## 🚀 Getting Started

### Prerequisites
```bash
Node.js 18+ and npm
```

### Installation
```bash
# Clone the repository
git clone https://github.com/kunini79/Kay-Website-Services.git
cd Kay-Website-Services

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables
Create a `.env.local` file with:
```env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

Get your Gemini API key at: https://ai.google.dev/

### Running the Application
```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

Access EncartaKids at: `http://localhost:3000/system`

---

## 📖 User Guide

### For Students

#### Starting Your Journey
1. Visit the EncartaKids homepage
2. Check out today's featured topic and fun fact
3. Choose a category that interests you
4. Click on a topic to read an article

#### Reading Articles
- **Read Aloud**: Click the speaker icon to hear the article
- **Bookmark**: Save articles for later with the bookmark icon
- **Print**: Print articles for offline reading
- **Quiz**: Take a quiz after reading to test your knowledge

#### Earning Points & Badges
- **Read Articles**: +10 points per article
- **Complete Quizzes**: +20-50 points based on score
- **Perfect Quiz**: +50 points bonus
- **Earn Badges**: +100 points per badge
- **Daily Challenges**: +25 points

#### Tracking Progress
1. Click the progress button (bottom right corner)
2. View your stats, badges, and achievements
3. See which categories you've explored
4. Check your quiz performance

### For Parents/Teachers

#### Monitoring Progress
- Progress dashboard shows all learning activity
- View articles read by category
- Check quiz scores and performance
- Monitor learning streaks

#### Educational Value
- **Curriculum Aligned**: Topics cover major educational standards
- **Safe Content**: Age-appropriate AI-generated content
- **Self-Paced**: Students learn at their own speed
- **Engaging**: Gamification encourages continued learning

---

## 🎨 Categories & Topics

### 🦁 Animals
Learn about mammals, birds, reptiles, ocean life, and endangered species.

### 🔬 Science
Explore the human body, solar system, weather, plants, and experiments.

### 🏆 Sports & Recreation
Discover sports, athletes, fitness, and the Olympics.

### 🎨 Arts
Create with drawing, music, dance, photography, and famous artists.

### 📚 Reading & Writing
Enjoy folktales, poetry, creative writing, and great books.

### 👑 People
Meet heroes, inventors, leaders, scientists, and everyday heroes.

### 🗺️ Places
Explore continents, countries, natural wonders, and famous cities.

### 🏛️ History
Travel back to ancient civilizations, kingdoms, and important inventions.

### 🏘️ Social Studies
Learn about citizenship, government, culture, and global peace.

### 🎮 Games & Fun
Enjoy brain teasers, puzzles, riddles, and creative challenges.

---

## 🏅 Achievement Badges

| Badge | Requirement | Points |
|-------|-------------|---------|
| 🌟 First Steps | Read 1 article | 100 |
| 📚 Bookworm | Read 10 articles | 100 |
| 🦸 Super Reader | Read 50 articles | 100 |
| 🎯 Quiz Starter | Complete 1 quiz | 100 |
| 🏆 Quiz Champion | Perfect score on 5 quizzes | 100 |
| 🔥 Week Warrior | 7-day learning streak | 100 |
| 🌍 World Explorer | Read from all 10 categories | 100 |
| 🔍 Curious Mind | Search 25 topics | 100 |
| 🦉 Night Owl | Read after 8 PM | 100 |
| 🐦 Early Bird | Read before 7 AM | 100 |

---

## 🛠️ Technical Architecture

### Frontend
- **Framework**: Next.js 16 (React 19)
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **TypeScript**: Full type safety

### AI & Services
- **AI Model**: Google Gemini Pro
- **Content Generation**: Real-time article creation
- **Quiz Generation**: AI-powered question generation

### Storage
- **Local Storage**: Progress, bookmarks, quiz history
- **No Backend Required**: Fully client-side application
- **Privacy First**: No data collection or tracking

### Key Components
```
app/system/
├── page.tsx                 # Main system page
├── components/
│   ├── Header.tsx          # Navigation header
│   ├── HomeView.tsx        # Category selection
│   ├── ArticleView.tsx     # Article display
│   ├── QuizComponent.tsx   # Quiz interface
│   ├── ProgressDashboard.tsx # Progress tracking
│   └── TodayILearned.tsx   # Daily highlights
├── services/
│   ├── geminiService.ts    # AI article generation
│   ├── quizService.ts      # Quiz management
│   ├── progressTracking.ts # Achievement system
│   └── dailyHighlights.ts  # Daily content
└── types.ts                # TypeScript definitions
```

---

## 📊 Analytics & Insights

### Progress Metrics
- Articles read (total and by category)
- Quizzes completed and average score
- Current learning streak
- Total points earned
- Badges unlocked

### Learning Patterns
- Most explored categories
- Search history and preferences
- Quiz performance trends
- Peak learning times

---

## 🎯 Development Roadmap

### ✅ Completed (Week 1)
- [x] Brand redesign as EncartaKids
- [x] Interactive quiz system
- [x] Achievement badges and progress tracking
- [x] Bookmark functionality
- [x] Daily highlights and fun facts
- [x] Search history tracking

### 🔄 In Progress
- [ ] Age-based content filtering
- [ ] Parent/teacher dashboard
- [ ] Offline mode support
- [ ] Enhanced accessibility features

### 📋 Future Features
- [ ] Multi-language support
- [ ] Video content integration
- [ ] Collaborative learning features
- [ ] Custom learning paths
- [ ] AR/VR experiences

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Report Bugs**: Open an issue describing the problem
2. **Suggest Features**: Share ideas for new features
3. **Submit PRs**: Fix bugs or add features
4. **Improve Docs**: Help make documentation better

---

## 📝 License

This project is part of Kay-Website-Services.

---

## 🌟 Credits

### Built With
- [Next.js](https://nextjs.org/) - React Framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Google Gemini](https://ai.google.dev/) - AI Content Generation
- [Lucide Icons](https://lucide.dev/) - Beautiful Icons

### Inspired By
- Microsoft Encarta
- Wikipedia
- Khan Academy
- Duolingo's gamification

---

## 📧 Support

### For Students
- Explore the help section in the app
- Ask a parent or teacher for assistance

### For Parents/Teachers
- Email: support@encartakids.com
- Check the FAQ section
- Join our community forum

### For Developers
- GitHub Issues: Report bugs and feature requests
- Documentation: See ENCARTAKIDS_DEVELOPMENT_PLAN.md
- API Docs: Coming soon

---

## 🎓 Educational Standards

EncartaKids content aligns with:
- **Common Core Standards** (Reading, Writing)
- **NGSS** (Next Generation Science Standards)
- **21st Century Skills** (Critical thinking, Digital literacy)

---

## 🔒 Privacy & Safety

### Our Commitment
- **No Data Collection**: All progress stored locally
- **Age-Appropriate**: AI content filtered for children
- **COPPA Compliant**: Children's privacy protected
- **Safe Environment**: No external links without permission

### Parent Controls
- Monitor progress through dashboard
- Export progress reports
- Control quiz difficulty
- Manage bookmarked content

---

## 🌈 Accessibility

EncartaKids is designed to be accessible to all learners:
- **Screen Reader Support**: ARIA labels throughout
- **Keyboard Navigation**: Full keyboard accessibility
- **Read Aloud**: Text-to-speech for all articles
- **High Contrast**: Optional high contrast mode
- **Adjustable Text**: Increase text size as needed

---

## 📱 Browser Support

EncartaKids works on:
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🎉 Fun Facts About EncartaKids

- **365 Days of Learning**: New fun fact every day for a full year!
- **10 Categories**: Covering all major educational topics
- **Infinite Topics**: AI can generate articles on virtually any subject
- **Interactive Quizzes**: Every article can have a custom quiz
- **Gamified Learning**: Make education fun with points and badges

---

## 📞 Contact

- **Website**: https://encartakids.com
- **Email**: hello@encartakids.com
- **GitHub**: https://github.com/kunini79/Kay-Website-Services

---

<div align="center">

### Made with ❤️ for curious young minds

**EncartaKids - Where Learning Comes Alive! 🌟**

[Start Learning](http://localhost:3000/system) | [View Progress](#) | [Get Help](#)

</div>
