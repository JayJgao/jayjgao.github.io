import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CareerTimeline } from "@/components/home/CareerTimeline";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { HeroSection } from "@/components/home/HeroSection";
import { VideoSpotlightCarousel } from "@/components/home/VideoSpotlightCarousel";
import { getMessages } from "@/lib/i18n";
import { isLocale } from "@/lib/locale";
import { createLocalizedMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const copy = getMessages(locale).home.hero;
  return createLocalizedMetadata({
    locale,
    path: "/",
    title: `${copy.name} | AI Product Leader`,
    description: `${copy.headline} ${copy.subheadline}`,
  });
}

export default function HomePage() {
  return (
    <main className="page-container space-y-10 py-6 md:space-y-14 md:py-12">
      <HeroSection />
      <FeaturedProjects />
      <VideoSpotlightCarousel />
      <CareerTimeline />
    </main>
  );
}
