import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { VideoSpotlightCarousel } from "@/components/home/VideoSpotlightCarousel";
import { CareerTimeline } from "@/components/home/CareerTimeline";

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
