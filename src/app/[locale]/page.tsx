import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CareerTimeline } from "@/components/home/CareerTimeline";
import { DemosPreview } from "@/components/home/DemosPreview";
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
    description: `${copy.headline} ${copy.subheadline} ${copy.supporting}`,
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <main id="main-content" className="home-editorial">
      <div data-home-section="hero">
        <HeroSection />
      </div>
      <div data-home-section="demos">
        <DemosPreview locale={locale} />
      </div>
      <div data-home-section="featured">
        <FeaturedProjects />
      </div>
      <div data-home-section="spotlight">
        <VideoSpotlightCarousel />
      </div>
      <div data-home-section="timeline">
        <CareerTimeline />
      </div>
    </main>
  );
}
