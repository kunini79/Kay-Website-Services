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
        url: "https://www.geminatefoundation.org.ng",
        image: "/projects/geminate.png",
        tags: ["React", "Tailwind CSS", "Non-Profit", "Responsive Design"]
    },
    {
        id: 2,
        title: "Itsybits.dev",
        description: "Professional portfolio for education consultant showcasing expertise and impact",
        category: "WEB • DESIGN",
        url: "https://www.itsybits.dev",
        image: "/projects/itsybits.png",
        tags: ["Portfolio", "Modern Design", "Consulting", "Professional"]
    },
    {
        id: 3,
        title: "Yola Turf Club",
        description: "Premier horse racing and social club website with event management",
        category: "WEB • E-COMMERCE",
        url: "https://www.yolaturfclub.com.ng",
        image: "/projects/yolaturf.png",
        tags: ["Events", "Membership", "Sports", "Community"]
    },
    {
        id: 4,
        title: "AUN Schools Portal",
        description: "Educational management system for American University of Nigeria schools",
        category: "WEB • PLATFORM",
        url: "https://www.schools.aun.edu.ng",
        image: "/projects/aun-schools.png",
        tags: ["Education", "Portal", "Management System", "University"]
    }
];
