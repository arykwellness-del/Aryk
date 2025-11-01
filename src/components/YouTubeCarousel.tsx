import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface YouTubeCarouselProps {
  videoIds: string[];
  title?: string;
  subtitle?: string;
}

const YouTubeCarousel = ({ videoIds, title = "From our YouTube", subtitle = "Latest videos from our channel" }: YouTubeCarouselProps) => {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-6 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-serif font-light text-foreground">{title}</h2>
          <p className="text-sm md:text-base text-muted-foreground">{subtitle}</p>
        </div>

        <div className="relative">
          <div
            ref={scrollerRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth py-2 [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            <style>{`.container ::-webkit-scrollbar{display:none}`}</style>
            {videoIds.map((id, idx) => (
              <div key={id} className="snap-start shrink-0 w-[280px] sm:w-[360px] md:w-[420px]">
                <div className="aspect-video rounded-xl overflow-hidden bg-black">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${id}`}
                    title={`YouTube video ${idx + 1}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between">
            <Button
              aria-label="Previous"
              size="icon"
              variant="ghost"
              className="pointer-events-auto ml-1 sm:ml-2 rounded-full bg-white/70 hover:bg-white text-foreground border border-black/10 transition-all duration-500 ease-out hover:scale-110 hover:shadow-lg"
              onClick={() => scrollerRef.current?.scrollBy({ left: -420, behavior: "smooth" })}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              aria-label="Next"
              size="icon"
              variant="ghost"
              className="pointer-events-auto mr-1 sm:mr-2 rounded-full bg-white/70 hover:bg-white text-foreground border border-black/10 transition-all duration-500 ease-out hover:scale-110 hover:shadow-lg"
              onClick={() => scrollerRef.current?.scrollBy({ left: 420, behavior: "smooth" })}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default YouTubeCarousel;


