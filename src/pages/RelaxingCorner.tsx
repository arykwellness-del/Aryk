import { useEffect, useRef, useState } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import AuthModal from "@/components/AuthModal";
import CartSidebar from "@/components/CartSidebar";
import { useToast } from "@/hooks/use-toast";
import { useCart, CartItem } from "@/contexts/CartContext";
import { saveThought } from "@/services/googleSheetsService";
import ThoughtsDisplay from "@/components/ThoughtsDisplay";

type Bubble = {
  id: number;
  x: number;
  y: number;
  radius: number;
  speed: number;
  hue: number;
};


type User = {
  id: number;
  email: string;
  name: string;
};

const RelaxingCorner = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const bubblesRef = useRef<Bubble[]>([]);
  const nextIdRef = useRef(1);
  const rafRef = useRef<number | null>(null);
  const { toast } = useToast();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { 
    cartItems, 
    isCartOpen, 
    setIsCartOpen, 
    addToCart,
    updateCartQuantity, 
    removeFromCart, 
    getCartCount 
  } = useCart();

  // Video testimonials data (demo: repeat available videos)
  const videoTestimonials = [
    { id: 1, src: "/videos/hero.mp4", title: "Customer Testimonial #1" },
    { id: 2, src: "/videos/about-background.mp4", title: "Customer Testimonial #2" },
    { id: 3, src: "/videos/hero.mp4", title: "Customer Testimonial #3" },
    { id: 4, src: "/videos/about-background.mp4", title: "Customer Testimonial #4" },
    { id: 5, src: "/videos/hero.mp4", title: "Customer Testimonial #5" },
    { id: 6, src: "/videos/about-background.mp4", title: "Customer Testimonial #6" },
  ];

  // No local storage - data only stored in Google Sheets
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const spawn = () => {
      const radius = 16 + Math.random() * 20;
      bubblesRef.current.push({
        id: nextIdRef.current++,
        x: Math.random() * canvas.width,
        y: canvas.height + radius,
        radius,
        speed: 0.4 + Math.random() * 1.1,
        hue: 20 + Math.floor(Math.random() * 60),
      });
    };

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (bubblesRef.current.length < 22 && Math.random() < 0.2) spawn();
      bubblesRef.current = bubblesRef.current
        .map((b) => ({ ...b, y: b.y - b.speed }))
        .filter((b) => b.y + b.radius > -8);

      for (const b of bubblesRef.current) {
        const g = ctx.createRadialGradient(
          b.x - b.radius * 0.35,
          b.y - b.radius * 0.35,
          1,
          b.x,
          b.y,
          b.radius
        );
        g.addColorStop(0, `hsla(${b.hue},80%,70%,0.9)`);
        g.addColorStop(1, `hsla(${b.hue},70%,50%,0.15)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    loop();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Load cart and user
  useEffect(() => {
    const savedUser = localStorage.getItem('aryk_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // No loading - only storing thoughts to Google Sheets

  const onCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    let popped = false;
    bubblesRef.current = bubblesRef.current.filter((b) => {
      const hit = Math.hypot(b.x - x, b.y - y) <= b.radius;
      if (hit) popped = true;
      return !hit;
    });
    if (popped) setScore((s) => s + 1);
  };


  const handleCheckout = () => {
    if (!user) {
      setIsCartOpen(false);
      setIsAuthModalOpen(true);
      toast({ title: 'Please sign in', description: 'You need to sign in to proceed with checkout.' });
      return;
    }

    // Redirect to Shopify shop for checkout
    window.location.href = '/shopify-shop';
  };

  const handleLogin = (newUser: User) => setUser(newUser);
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('aryk_user');
    toast({ title: 'Logged out', description: 'You have been logged out successfully.' });
  };

  const submitThought = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input
    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      toast({
        title: 'Message required',
        description: 'Please enter a message before sharing.',
        variant: 'destructive'
      });
      return;
    }
    
    // Prevent multiple submissions
    if (isSyncing) {
      console.log('Already syncing, ignoring duplicate submission');
      return;
    }
    
    setIsSyncing(true);
    
    const thoughtData = {
      name: name.trim() || "Anonymous",
      message: trimmedMessage,
    };
    
    console.log('Submitting thought:', thoughtData);
    
    try {
      // Save to Google Sheets
      const success = await saveThought(thoughtData.name, thoughtData.message);
      
      if (success) {
        toast({ 
          title: 'Thought shared! ✨', 
          description: 'Thank you for sharing! Your thought will be reviewed and updated within 24 hours.' 
        });
        
        // Clear form after successful submission
        setMessage("");
        setName("");
        
        // Trigger refresh of thoughts display
        setRefreshTrigger(prev => prev + 1);
        
        console.log('✅ Thought submitted and form cleared');
      } else {
        throw new Error('Failed to save to Google Sheets');
      }
    } catch (error) {
      console.error('❌ Error submitting thought:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to save your thought. Please check your connection and try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="bg-background">
      <Header
        onCartClick={() => setIsCartOpen(true)}
        onAuthClick={() => setIsAuthModalOpen(true)}
        cartCount={getCartCount()}
        variant="solid"
      />
      <div className="pt-28 pb-16 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h2 className="text-3xl font-serif font-light text-foreground">Relaxing Corner</h2>
            <p className="text-muted-foreground">Pop gentle bubbles to unwind. Tap or click on rising bubbles.</p>
          </div>
          <div className="relative rounded-2xl overflow-hidden shadow-lg border border-border" style={{ height: "60vh" }}>
            <canvas ref={canvasRef} onClick={onCanvasClick} className="w-full h-full cursor-pointer" />
            <div className="absolute top-4 right-4 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-sm">
              Score: {score}
            </div>
          </div>
        </div>
      </div>

      {/* Video Testimonials - Horizontal scroller */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h3 className="text-2xl font-serif font-light text-foreground">Video Testimonials</h3>
            <p className="text-muted-foreground">Coming soon - Amazing customer stories.</p>
          </div>
          <div className="relative">
            <div className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth py-2 [-ms-overflow-style:none] [scrollbar-width:none]">
              <style>{`.container ::-webkit-scrollbar{display:none}`}</style>
              <div className="snap-start shrink-0 w-[280px] sm:w-[360px] md:w-[420px]">
                <div className="rounded-xl overflow-hidden border border-border bg-card">
                  <div className="aspect-video bg-muted/20 flex items-center justify-center">
                    <div className="text-center">
                      <h4 className="text-xl font-serif font-light text-foreground mb-2">COMING SOON</h4>
                      <p className="text-sm text-muted-foreground">Video testimonials</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Thoughts / Reviews */}
      <section className="py-16 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h3 className="text-2xl font-serif font-light text-foreground">Share Your Thoughts</h3>
            <p className="text-muted-foreground">Leave a short note, review, or quote.</p>
          </div>

          <form onSubmit={submitThought} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name (optional)"
              className="md:col-span-1"
              disabled={isSyncing}
              maxLength={100}
            />
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your thought..."
              className="md:col-span-2 min-h-[96px]"
              disabled={isSyncing}
              maxLength={500}
            />
            <div className="md:col-span-3 flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {message.length}/500 characters
              </div>
              <Button 
                type="submit" 
                disabled={isSyncing || !message.trim()}
                className="bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50"
              >
                {isSyncing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Share Thought'
                )}
              </Button>
            </div>
          </form>

        </div>
      </section>

      {/* Display Shared Thoughts */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h3 className="text-2xl font-serif font-light text-foreground">Community Thoughts</h3>
            <p className="text-muted-foreground">See what others are sharing in our relaxing corner.</p>
          </div>
          
          <ThoughtsDisplay refreshTrigger={refreshTrigger} />
        </div>
      </section>

      <Footer />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
      />

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
      />
    </div>
  );
};

export default RelaxingCorner;


