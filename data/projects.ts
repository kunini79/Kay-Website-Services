// Real project data for Kay Website Services portfolio

export interface Project {
    id: number;
    title: string;
    description: string;
    category: string;
    url: string;
    image: string;
    tags: string[];
}

export const projects: Project[] = [
    {
        id: 1,
        title: "Gem'inate Kids Foundation",
        description: "A vibrant non-profit website empowering children through education and community programs",
        category: "WEB • DEVELOPMENT",
        url: "https://geminate-foundation.vercel.app",
        image: "/projects/geminate.png",
        tags: ["React", "Tailwind CSS", "Non-Profit", "Responsive Design"]
    },
    {
        id: 2,
        title: "Itsybits.dev",
        description: "Professional portfolio for education consultant showcasing expertise and impact",
        category: "WEB • DESIGN",
        url: "https://itsy-bits.vercel.app",
        image: "/projects/itsybits.png",
        tags: ["Portfolio", "Modern Design", "Consulting", "Professional"]
    },
    {
        id: 3,
        title: "Yola Turf Club",
        description: "Premier horse racing and social club website with event management",
        category: "WEB • E-COMMERCE",
        url: "https://yola-turf.vercel.app",
        image: "/projects/yolaturf.png",
        tags: ["Events", "Membership", "Sports", "Community"]
    },
    {
        id: 4,
        title: "Haraji",
        description: "AI-powered tax calculator system for automated tax calculations and compliance",
        category: "WEB • AI APPLICATION",
        url: "https://haraji.vercel.app",
        image: "/projects/haraji.png",
        tags: ["AI", "Tax Calculator", "Automation", "Next.js"]
    },
    {
        id: 5,
        title: "AUN Hotel Website",
        description: "Modern hotel website with booking system and guest management for AUN Hotel",
        category: "WEB • HOSPITALITY",
        url: "https://aun-hotel-website.vercel.app",
        image: "/projects/aun-hotel.png",
        tags: ["Hospitality", "Booking System", "Hotel", "Next.js"]
    },
    {
        id: 6,
        title: "Alhuda Islamic Center",
        description: "Community website for Islamic center featuring prayer times, events, and educational resources",
        category: "WEB • COMMUNITY",
        url: "https://al-huda-teal.vercel.app",
        image: "/projects/alhuda.png",
        tags: ["Islamic", "Community", "Education", "Next.js"]
    }
];
