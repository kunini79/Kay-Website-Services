export interface FaqItem {
  question: string;
  answer: string;
}

export const faqs: FaqItem[] = [
  {
    question: "How long does a typical website take?",
    answer:
      "Most projects take 3–6 weeks depending on scope, approvals, and content readiness.",
  },
  {
    question: "Do you handle content and copywriting?",
    answer:
      "Yes. We can provide content strategy, copywriting, and simple brand messaging if needed.",
  },
  {
    question: "Can you redesign an existing website?",
    answer:
      "Absolutely. We audit your current site, identify gaps, and rebuild for performance and conversions.",
  },
  {
    question: "What do you need to get started?",
    answer:
      "A short discovery call, access to existing brand assets, and clarity on goals and timelines.",
  },
  {
    question: "Do you offer ongoing support?",
    answer:
      "Yes. We offer maintenance and growth support for updates, optimizations, and new features.",
  },
];
