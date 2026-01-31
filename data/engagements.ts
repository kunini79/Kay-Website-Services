export interface EngagementOption {
  title: string;
  description: string;
  highlights: string[];
}

export const engagementOptions: EngagementOption[] = [
  {
    title: "Discovery Sprint",
    description:
      "A fast, focused strategy session to clarify your goals and define the right direction.",
    highlights: ["Audit & strategy", "Quick wins", "Actionable roadmap"],
  },
  {
    title: "Website Build",
    description:
      "Complete design and development for a modern, high‑converting website.",
    highlights: ["UX + UI design", "Performance build", "Launch support"],
  },
  {
    title: "Growth Support",
    description:
      "Ongoing optimization, new features, and continuous improvements.",
    highlights: ["Monthly updates", "Conversion improvements", "Priority support"],
  },
];
