"use client";

import { SiteContentProvider, useSiteContentContext } from "@/context/SiteContentContext";
import { ReservationProvider } from "@/context/ReservationContext";
import { Hero } from "@/components/Hero";
import { News } from "@/components/News";
import { Menu } from "@/components/Menu";
import { About } from "@/components/About";
import { Footer } from "@/components/Footer";
import { FloatingEditBar } from "@/components/FloatingEditBar";
import { ReservationModal } from "@/components/ReservationModal";

function PageContent() {
  const { loading, content } = useSiteContentContext();

  if (loading || !content) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-base">
        <p className="text-deep">読み込み中...</p>
      </main>
    );
  }

  return (
    <main>
      <Hero />
      <News />
      <Menu />
      <About />
      <Footer />
      <FloatingEditBar />
      <ReservationModal />
    </main>
  );
}

export function HomeClient() {
  return (
    <SiteContentProvider>
      <ReservationProvider>
        <PageContent />
      </ReservationProvider>
    </SiteContentProvider>
  );
}
