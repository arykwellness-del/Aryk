import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import imgAshwagandha from "../../aryk img/WhatsApp Image 2025-08-19 at 20.33.55_f82027bb.jpg";
import imgVitaminC from "../../aryk img/WhatsApp Image 2025-08-19 at 20.33.52_9cb19fa4.jpg";
import imgTurmeric from "../../aryk img/WhatsApp Image 2025-08-19 at 20.33.53_9ec97964.jpg";

const TestimonialSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const { elementRef: sectionRef, isVisible: isSectionVisible } = useScrollAnimation({
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
  });

  const testimonials = [
    {
      id: 1,
      text: "I am already obsessing over this mask. My fave mask I've ever used!",
      author: "Allyson D.",
      product: "TURMERIC BRIGHTENING & EXFOLIATING MASK",
      rating: 4.9,
      reviewCount: 2134,
      image: imgTurmeric
    },
    {
      id: 2,
      text: "This serum has transformed my skin completely. I can't imagine my routine without it!",
      author: "Sarah M.",
      product: "VITAMIN C BRIGHTENING SERUM",
      rating: 4.8,
      reviewCount: 789,
      image: imgVitaminC
    },
    {
      id: 3,
      text: "The most luxurious skincare experience. My skin feels so nourished and healthy.",
      author: "Emma K.",
      product: "ASHWAGANDHA BOUNCE MOISTURISER",
      rating: 4.8,
      reviewCount: 1367,
      image: imgAshwagandha
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section 
      ref={sectionRef}
      className="py-12 lg:py-16 bg-accent text-white"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between max-w-6xl mx-auto gap-8 lg:gap-0">
          {/* Product image - visible on all screens */}
          <div 
            className={`w-full lg:w-1/3 transition-all duration-1200 ease-out delay-200 ${
              isSectionVisible 
                ? 'opacity-100 scale-100 translate-x-0' 
                : 'opacity-0 scale-95 lg:-translate-x-8 translate-y-6'
            }`}
          >
            <div className="aspect-square overflow-hidden max-w-xs mx-auto lg:max-w-none rounded-3xl">
              <img
                src={testimonials[currentSlide].image}
                alt={testimonials[currentSlide].product}
                className="w-full h-full object-cover transition-all duration-700 ease-out hover:scale-105 rounded-3xl"
                loading="lazy"
              />
            </div>
          </div>

          {/* Testimonial content */}
          <div 
            className={`w-full lg:w-2/3 lg:pl-16 transition-all duration-1200 ease-out delay-400 ${
              isSectionVisible 
                ? 'opacity-100 scale-100 translate-x-0' 
                : 'opacity-0 scale-95 lg:translate-x-8 translate-y-6'
            }`}
          >
            <div className="text-center lg:text-left">
              <p 
                className={`text-sm lg:text-sm text-white/80 mb-4 lg:mb-4 uppercase tracking-wide transition-all duration-1000 ease-out delay-500 ${
                  isSectionVisible 
                    ? 'opacity-100 scale-100 translate-y-0' 
                    : 'opacity-0 scale-95 translate-y-6'
                }`}
              >
                WHAT OUR FANS SAY
              </p>
              
              <blockquote 
                className={`text-lg sm:text-xl lg:text-3xl font-serif text-white mb-6 lg:mb-8 leading-relaxed transition-all duration-1000 ease-out delay-600 ${
                  isSectionVisible 
                    ? 'opacity-100 scale-100 translate-y-0' 
                    : 'opacity-0 scale-95 translate-y-8'
                }`}
              >
                "{testimonials[currentSlide].text}"
              </blockquote>
              
              <div 
                className={`mb-8 transition-all duration-1000 ease-out delay-700 ${
                  isSectionVisible 
                    ? 'opacity-100 scale-100 translate-y-0' 
                    : 'opacity-0 scale-95 translate-y-8'
                }`}
              >
                {/* Author hidden as requested */}
                {/* <p className="text-foreground font-medium mb-2">- {testimonials[currentSlide].author}</p> */}
                <Button variant="link" className="text-white p-0 h-auto font-normal underline transition-colors duration-500 ease-out hover:text-white/80 text-center lg:text-left">
                  <span className="block sm:inline">SHOP {testimonials[currentSlide].product}</span>
                </Button>
              </div>

              {/* Navigation */}
              <div 
                className={`flex items-center justify-center lg:justify-start gap-4 transition-all duration-1000 ease-out delay-800 ${
                  isSectionVisible 
                    ? 'opacity-100 scale-100 translate-y-0' 
                    : 'opacity-0 scale-95 translate-y-8'
                }`}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={prevSlide}
                  className="rounded-full border border-white/30 text-white transition-all duration-500 ease-out hover:scale-110 hover:bg-white/10 hover:shadow-md"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                {/* Slide indicators */}
                <div className="flex gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-500 ease-out hover:scale-125 ${
                        index === currentSlide ? 'bg-white' : 'bg-white/40'
                      }`}
                      onClick={() => setCurrentSlide(index)}
                    />
                  ))}
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextSlide}
                  className="rounded-full border border-white/30 text-white transition-all duration-500 ease-out hover:scale-110 hover:bg-white/10 hover:shadow-md"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;