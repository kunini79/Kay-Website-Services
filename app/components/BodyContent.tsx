'use client';

import { usePathname } from "next/navigation";
import SmoothScroll from "@/components/SmoothScroll";
import PageTransition from "@/components/PageTransition";
import Preloader from "@/components/Preloader";
import MobileSync from "@/components/MobileSync";
import ScrollProgress from "@/components/ScrollProgress";
import CursorFollower from "@/components/CursorFollower";
import { ThemeProvider } from "@/context/ThemeContext";

export default function BodyContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isThinkBoxSystem = pathname?.startsWith('/system');

  return (
    <ThemeProvider>
      <Preloader />
      <ScrollProgress />
      {!isThinkBoxSystem && <CursorFollower />}
      {!isThinkBoxSystem && <MobileSync />}
      <SmoothScroll>
        <PageTransition>{children}</PageTransition>
      </SmoothScroll>
    </ThemeProvider>
  );
}