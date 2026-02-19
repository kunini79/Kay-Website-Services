import { Fredoka, Nunito } from 'next/font/google';
import type { Metadata } from 'next';

const fredoka = Fredoka({
  variable: '--font-fredoka',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const nunito = Nunito({
  variable: '--font-nunito',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

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
  return (
    <div className={`${fredoka.variable} ${nunito.variable} thinkbox-root`}>
      {children}
    </div>
  );
}
