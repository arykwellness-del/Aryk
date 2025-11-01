import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const { elementRef, isVisible } = useScrollAnimation({
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
  });
  const navigate = useNavigate();

  return (
    <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
      {/* Background video */}
      <div className="absolute inset-0">
        <video
          className="w-full h-full object-cover"
          src="/videos/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>
      
      {/* Content */}
      <div 
        ref={elementRef}
        className={`relative z-10 container mx-auto px-4 h-full flex flex-col justify-center transition-all duration-1200 ease-out ${
          isVisible 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-95 translate-y-8'
        }`}
      >
        {/* Breadcrumb */}
        <nav 
          className={`text-xs md:text-sm text-white/80 mb-6 md:mb-8 transition-all duration-1000 ease-out delay-200 ${
            isVisible 
              ? 'opacity-100 scale-100 translate-x-0' 
              : 'opacity-0 scale-95 -translate-x-6'
          }`}
        >
          <span className="hover:text-white cursor-pointer transition-colors duration-500 ease-out">HOME</span>
          <span className="mx-2">/</span>
          <span className="text-white">SKINCARE</span>
        </nav>

        {/* Main heading */}
        <div className="max-w-2xl">
          <h1 
            className={`text-4xl md:text-7xl font-serif font-light text-white leading-tight mb-4 md:mb-6 transition-all duration-1200 ease-out delay-400 ${
              isVisible 
                ? 'opacity-100 scale-100 translate-y-0' 
                : 'opacity-0 scale-95 translate-y-12'
            }`}
          >
            Skincare
          </h1>
          <p 
            className={`text-base md:text-lg text-white/90 mb-6 md:mb-8 max-w-lg transition-all duration-1000 ease-out delay-600 ${
              isVisible 
                ? 'opacity-100 scale-100 translate-y-0' 
                : 'opacity-0 scale-95 translate-y-8'
            }`}
          >
            Follow our three step skincare routine for naturally, healthy skin.
          </p>
          
          <Button 
            size="lg" 
            className={`bg-transparent text-white border-2 border-white hover:bg-white/10 px-6 md:px-8 py-4 md:py-6 text-base md:text-lg transition-all duration-1000 ease-out delay-800 hover:scale-[1.02] hover:shadow-lg ${
              isVisible 
                ? 'opacity-100 scale-100 translate-y-0' 
                : 'opacity-0 scale-95 translate-y-8'
            }`}
            onClick={() => navigate('/shopify-shop')}
          >
            DISCOVER PRODUCTS
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;