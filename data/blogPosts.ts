export interface BlogSlide {
  image: string;
  label: string;
}

export interface BlogSection {
  heading: string;
  body: string[];
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishedAt: string;
  featured: boolean;
  tags: string[];
  coverImage: string;
  intro: string[];
  sections: BlogSection[];
  closingCta: string;
  slides: BlogSlide[];
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "New Screen Time Rules for Under-5s: Is Your Child's Brain at Risk?",
    slug: "new-screen-time-rules-for-under-5s",
    excerpt:
      "New guidance released on March 27, 2026 is pushing parents everywhere to rethink screen habits for children under five and the effect they can have on young brains.",
    category: "Family Tech",
    readTime: "6 min read",
    publishedAt: "April 13, 2026",
    featured: true,
    tags: ["Parenting", "Screen Time", "Child Development"],
    coverImage: "/blog/screen-time/1.jpg",
    intro: [
      "Whether you are in Lagos, London, or Abuja, the challenge for modern parents is the same: the glowing screen in our children's hands. We often use it for a moment of peace, but are we doing enough to protect young brains?",
      "On March 27, 2026, the UK government released urgent new advice that every parent, no matter where they live, needs to hear.",
      "This is not about guilt. It is about understanding how your child's brain actually works. From processing speeds to emotional regulation, the latest science explains why we need to shift our habits today.",
    ],
    sections: [
      {
        heading: "The Core Guidelines: Global Standards for Your Home",
        body: [
          "Under 2s: Avoid screen time entirely. The only exception is shared activities like video calls with family that encourage bonding.",
          "Aged 2 to 5: Limit viewing to a maximum of 1 hour per day, though less is always better.",
        ],
      },
      {
        heading: "Why the Shift? Understanding the Science",
        body: [
          "It is not just about the time spent. It is also about how toddlers process digital information.",
          "Processing Speed: Toddlers process information up to 10 times slower than adults.",
          "The Stress System: Fast-paced content can trigger a child's stress system, causing them to respond to on-screen events as if they were real-world peril.",
          "Emotional Regulation: High levels of early screen time correlate with increased tantrums and difficulties with emotional regulation.",
        ],
      },
      {
        heading: "Watch Together: Quality Over Distraction",
        body: [
          "Rather than using a tablet as a digital nanny, try using screens as a shared activity.",
          "Tech-Free Zones: Keep bedrooms and mealtimes free from screens.",
          "Content Choice: Opt for slow-paced, predictable content.",
          "What to Avoid: Steer clear of fast-paced social media clips and AI toys, tools, or chatbots until more evidence is available.",
        ],
      },
      {
        heading: "Practical Tips for Busy Parents",
        body: [
          "Balancing technology is a learning process for everyone, and it is okay to start small.",
          "Do not pressure yourself. You do not need to cut everything out immediately, especially if technology is a vital part of your family's routine.",
          "Trust your instincts. Remember that you are the expert on your child.",
        ],
      },
      {
        heading: "Official Resources & Next Steps",
        body: [
          'To read the full research and find "Screen Swap" ideas, visit the official Best Start in Life Hub.',
          "Curious about how technology affects your family? Do not navigate this alone. Sign up for our newsletter today to get practical tips and the latest science delivered straight to your inbox.",
        ],
      },
    ],
    closingCta:
      "Curious about how technology affects your family? Follow along for practical tips, timely science, and calmer ways to navigate screen habits at home.",
    slides: [
      { image: "/blog/screen-time/1.jpg", label: "Intro" },
      { image: "/blog/screen-time/2.jpg", label: "Core Guidelines" },
      { image: "/blog/screen-time/3.jpg", label: "Watch Together" },
      { image: "/blog/screen-time/4.jpg", label: "Why the Shift?" },
      { image: "/blog/screen-time/5.jpg", label: "Practical Tips" },
      { image: "/blog/screen-time/6.jpg", label: "Follow Us" },
    ],
  },
];
