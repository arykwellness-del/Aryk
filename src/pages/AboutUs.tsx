import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, Leaf, Heart, Users, Target, Shield, Star, Globe, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";

const AboutUs = () => {
  const navigate = useNavigate();
  const { 
    cartItems, 
    isCartOpen, 
    setIsCartOpen, 
    updateCartQuantity, 
    removeFromCart, 
    getCartCount 
  } = useCart();
  
  return (
    <>
      <Header
        onCartClick={() => setIsCartOpen(true)}
        onAuthClick={() => {}}
        cartCount={getCartCount()}
        variant="transparent"
      />
      
      <div className="min-h-screen bg-background pt-0">
        {/* Hero Section - EXACT KORA STYLE with Video Background */}
        <div className="relative h-[70vh] md:h-screen overflow-hidden">
          {/* Video Background */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/videos/IMG_9672.mp4" type="video/mp4" />
          </video>
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30"></div>
          
          {/* Content */}
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="text-center max-w-5xl mx-auto px-4">
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-light text-white mb-6 md:mb-12 leading-tight">
             Your Best Self. Willingly.
              </h1>
              <p className="text-base sm:text-lg md:text-2xl text-white/90 leading-relaxed max-w-3xl md:max-w-4xl mx-auto font-light px-2">
Caring for your skin is a quiet kind of strength, it’s a moment to slow down, soothe, and reconnect with yourself. It nourishes more than your complexion, bringing out a light that feels as real within as it looks outside.              </p>
            </div>
          </div>
        </div>

        {/* Three Pillars Section - EXACT KORA LAYOUT with Images */}
        <div className="py-12 sm:py-16 md:py-24 relative overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
           /* <img 
              src="/aryk img/WhatsApp Image 2025-08-23 at 14.40.37.jpeg"
              alt=""
              className="w-full h-full object-cover"
            />*/
            <div className="absolute inset-0 bg-white/80"></div>
          </div>
          
          {/* Content */}
          <div className="relative z-10 container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 max-w-7xl mx-auto">
              {/* Highly Effective */}
              <div className="text-center">
                <div className="mb-6 md:mb-8">
                  <img 
                    src="/sanctuary-of-time.jpg" 
                    alt="A Sanctuary of Time"
                    className="w-full h-40 sm:h-52 md:h-64 object-cover shadow-lg rounded-xl"
                  />
                </div>
                <h3 className="text-2xl md:text-3xl font-serif font-light text-foreground mb-4 md:mb-6">
                 A Sanctuary of Time
                </h3>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                 You step away from the noise. This welcomed pause, focused on your senses, is self-respect in action.

                </p>
              </div>

              {/* Certified Organic */}
              <div id="certified-organic" className="text-center">
                <div className="mb-6 md:mb-8">
                  <img 
                    src="/power-of-connection.jpeg" 
                    alt="The Power of Connection"
                    className="w-full h-40 sm:h-52 md:h-64 object-cover shadow-lg rounded-xl"
                  />
                </div>
                <h3 className="text-2xl md:text-3xl font-serif font-light text-foreground mb-4 md:mb-6">
                The Power of Connection
                </h3>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                You engage your body and mind, reinforcing the belief that you are worthy of consistent, gentle care.
                </p>
              </div>

              {/* Always Uplifting */}
              <div className="text-center">
                <div className="mb-6 md:mb-8">
                  <img 
                    src="/science-of-soul.jpg" 
                    alt="The Science of Soul"
                    className="w-full h-40 sm:h-52 md:h-64 object-cover shadow-lg rounded-xl"
                  />
                </div>
                <h3 className="text-2xl md:text-3xl font-serif font-light text-foreground mb-4 md:mb-6">
                The Science of Soul
                </h3>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                Our formulations support your skin, while your intention supports your peace.
                </p>
              </div>
            </div>
          </div>
        </div>



        {/* Founder's Story Section - EXACT KORA LAYOUT */}
        <div className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 id="our-story" className="text-3xl sm:text-4xl md:text-5xl font-serif font-light text-foreground text-center mb-10 md:mb-20">
                Founder's Story
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 items-start">
              <div className="space-y-8">
  <p className="text-base md:text-xl text-muted-foreground leading-relaxed text-justify">
Hi, I’m Saryu, a molecular biologist, skincare enthusiast, and eldest daughter who learned that strength can also mean slowing down.
  </p>
  
  <p className="text-base md:text-xl text-muted-foreground leading-relaxed text-justify">
      ARYK, pronounced “ark,” comes from the Sanskrit word for a ray of sunshine, the same light skincare became for me when I couldn’t see myself clearly.
  </p>
  
  <p className="text-base md:text-xl text-muted-foreground leading-relaxed text-justify">
    Inspired by my mum’s haldi, honey, and rose water rituals, I grew to see skincare not as vanity, but care. Years later, when I struggled with body dysmorphia, those roots grounded me again; skincare became my calm, my way back to peace.
  </p>
     <p className="text-base md:text-xl text-muted-foreground leading-relaxed text-justify">
         As a scientist, I see skincare as the meeting point of science and soul; where chemistry turns into care. Every ARYK formula is clean, intentional, and made to support both your skin and your sense of self.
     </p>
     <p className="text-base md:text-xl text-muted-foreground leading-relaxed text-justify">    
        Beyond products, ARYK is a community. A safe space to connect, slow down, and remind each other that healing feels softer when shared. The inverted "Y" in our logo is you, who is unique, growing, and beautifully your own.
     </p>
    <p className="text-base md:text-xl text-muted-foreground leading-relaxed text-justify">
      ARYK is your ray of sunshine, and a reminder that the science of caring begins with you.
      </p>
</div>

                
                <div className="text-center">
                <div className="bg-gray-50 p-10 md:p-16 rounded-3xl">
                  {/* Image Container */}
          <div className="w-28 h-28 md:w-40 md:h-40 bg-white rounded-full mx-auto mb-6 md:mb-8 flex items-center justify-center shadow-sm overflow-hidden"> 
            <img src="/images/aryk/mainfounder1.jpg"
              alt="Saryu Nayak - Founder" 
              className="w-full h-full object-cover rounded-full"
              />
            </div>

                  {/* Name */}
                  <h3 className="text-xl md:text-2xl font-serif font-light text-foreground mb-2 md:mb-3">
                    Saryu Nayak
                  </h3>
              
                  {/* Position */}
                  <p className="text-sm md:text-lg text-muted-foreground">
                    Founder, CEO
                  </p>
                </div>
              </div>

              </div>
            </div>
          </div>
        </div>

       
        {/* Final CTA Section - EXACT KORA STYLE */}
        <div className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0">
            <img
              className="w-full h-full object-cover"
              src="/hero-bg.jpeg"
              alt="Self care background"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
          <div className="relative z-10 container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-light text-white mb-6 md:mb-8">
            Experience self care like never before.
            </h2>
            <p className="text-base md:text-xl text-white/90 mb-8 md:mb-12 max-w-3xl mx-auto font-light px-2">
            Step into our community of like-minded souls and explore products made to celebrate you. Because you’re the hero, and our products are your perfect sidekick
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-black hover:bg-white/90 text-base md:text-lg px-6 md:px-8 py-3 md:py-4 font-medium"
                onClick={() => navigate("/shopify-shop")}
              >
                Shop Now
              </Button>
              {/* Learn More button removed as requested */}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={() => {
          // Check if user is signed in
          const savedUser = localStorage.getItem('aryk_user');
          if (!savedUser) {
            // Show auth modal or redirect to sign in
            window.location.href = '/shopify-shop';
            return;
          }
          // Redirect to Shopify shop for checkout
          window.location.href = '/shopify-shop';
        }}
      />
    </>
  );
};

export default AboutUs;
