import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { VideoSpotlightCarousel } from "@/components/home/VideoSpotlightCarousel";
import { CareerTimeline } from "@/components/home/CareerTimeline";

export default function HomePage() {
  return (
    <main className="page-container space-y-11 py-8 md:space-y-16 md:py-14">
      <HeroSection />
      <VideoSpotlightCarousel />
      <FeaturedProjects />
      <CareerTimeline />
    </main>
  );
}
