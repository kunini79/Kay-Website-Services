import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ThinkBox — Explore Everything',
  description:
    'A modern children\'s educational encyclopedia. Explore animals, science, history, and more.',
};

export default function SystemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="thinkbox-root">{children}</div>;
}
