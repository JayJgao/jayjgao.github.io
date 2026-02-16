import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { CareerTimeline } from "@/components/home/CareerTimeline";

export default function HomePage() {
  return (
    <main className="page-container space-y-16 py-10 md:py-14">
      <HeroSection />
      <FeaturedProjects />
      <CareerTimeline />
    </main>
  );
}
