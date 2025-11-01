import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, User, ShoppingBag, Menu, X, Heart, Home, Info, Phone, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShopifyService } from "@/lib/shopifyService";

interface HeaderProps {
  onCartClick: () => void;
  onAuthClick: () => void;
  cartCount: number;
  variant?: "transparent" | "solid";
}

const Header = ({ onCartClick, onAuthClick, cartCount, variant = "transparent" }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Array<{ id: string | number; name: string; image: string; handle?: string }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlighted, setHighlighted] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [recent, setRecent] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('aryk_recent_searches');
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  });
  const searchWrapRef = useRef<HTMLDivElement | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  // Handle scroll effect for header background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine header variant based on scroll and prop
  const headerVariant = variant === 'transparent' && !isScrolled ? 'transparent' : 'solid';

  // Fetch lightweight suggestions as user types
  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      const q = searchQuery.trim();
      if (!q) {
        setSuggestions([]);
        return;
      }
      try {
        setIsLoading(true);
        const result = await ShopifyService.getProducts(10);
        const products = result.products.map(ShopifyService.convertToProduct);
        const filtered = products
          .filter(p => p.name.toLowerCase().includes(q.toLowerCase()))
          .slice(0, 5)
          .map(p => ({ id: p.id, name: p.name, image: p.image, handle: p.handle }));
        setSuggestions(filtered);
      } catch {
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };
    const t = setTimeout(load, 200);
    return () => { clearTimeout(t); controller.abort(); };
  }, [searchQuery]);

  const submitSearch = () => {
    const q = searchQuery.trim();
    if (!q) return;
    // record recent searches (unique, max 5)
    try {
      const updated = [q, ...recent.filter(r => r.toLowerCase() !== q.toLowerCase())].slice(0, 5);
      setRecent(updated);
      localStorage.setItem('aryk_recent_searches', JSON.stringify(updated));
    } catch {}
    navigate(`/shopify-shop?q=${encodeURIComponent(q)}`);
    setShowSuggestions(false);
    setHighlighted(-1);
  };

  // Keyboard navigation
  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const total = suggestions.length + (recent.length && !searchQuery ? recent.length : 0);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setShowSuggestions(true);
      setHighlighted((h) => Math.min(h + 1, Math.max(total - 1, 0)));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, -1));
    } else if (e.key === 'Enter') {
      if (highlighted >= 0) {
        const items = searchQuery ? suggestions : recent.map((q) => ({ q })) as any;
        const sel: any = items[highlighted];
        if (sel?.id) {
          navigate(`/product/${sel.id}`);
          setShowSuggestions(false);
          setHighlighted(-1);
          return;
        }
        if (sel?.q) {
          setSearchQuery(sel.q);
          navigate(`/shopify-shop?q=${encodeURIComponent(sel.q)}`);
          setShowSuggestions(false);
          setHighlighted(-1);
          return;
        }
      }
      submitSearch();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setHighlighted(-1);
    }
  };

  // Close suggestions on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!searchWrapRef.current) return;
      if (!searchWrapRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
        setHighlighted(-1);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <>
      {/* Header */}
      <header className={`${headerVariant === 'transparent' ? 'absolute bg-transparent' : 'sticky top-0 bg-background/90 supports-[backdrop-filter]:bg-background/70 border-b border-border backdrop-blur'} left-0 right-0 z-50 transition-all duration-700 ease-out`}>
        <div className="container mx-auto px-4 relative">
          <div className={`flex items-center justify-between h-14 md:h-20 transition-all duration-700 ease-out ${headerVariant === 'transparent' ? 'text-white' : 'text-foreground'}`}>
            {/* Left: burger + mobile relaxing corner + desktop links */}
            <div className="flex items-center gap-4 md:gap-6">
              <Button
                variant="ghost"
                size="icon"
                className={`${headerVariant === 'transparent' ? 'text-white hover:text-white/90' : 'text-foreground hover:text-foreground/90'} hover:!bg-transparent transition-all duration-500 ease-out hover:scale-110 hover:shadow-md`}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>

              {/* Mobile Relaxing Corner icon - moved to left */}
              <Button
                variant="ghost"
                size="icon"
                className={`${headerVariant === 'transparent' ? 'text-white hover:text-white/90' : 'text-foreground hover:text-foreground/90'} hover:!bg-transparent transition-all duration-500 ease-out hover:scale-110 hover:shadow-md md:hidden`}
                onClick={() => navigate('/relaxing-corner')}
                aria-label="Relaxing Corner"
              >
                <Gamepad2 className="h-5 w-5" />
              </Button>

              <nav className="hidden md:flex items-center gap-6 uppercase tracking-wide text-sm">
                <Button
                  variant="ghost"
                  className={`relative ${headerVariant === 'transparent' ? 'text-white hover:text-white/90' : 'text-foreground hover:text-foreground/90'} hover:!bg-transparent after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:w-full after:origin-left after:scale-x-0 ${headerVariant === 'transparent' ? 'after:bg-white' : 'after:bg-foreground'} after:transition-transform after:duration-500 after:[transition-timing-function:cubic-bezier(0.25,0.46,0.45,0.94)] hover:after:scale-x-100 transition-all duration-500 [transition-timing-function:cubic-bezier(0.25,0.46,0.45,0.94)] hover:scale-105`}
                  onClick={() => navigate("/shopify-shop")}
                >
                  SHOP
                </Button>
                <Button
                  variant="ghost"
                  className={`relative ${headerVariant === 'transparent' ? 'text-white hover:text-white/90' : 'text-foreground hover:text-foreground/90'} hover:!bg-transparent after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:w-full after:origin-left after:scale-x-0 ${headerVariant === 'transparent' ? 'after:bg-white' : 'after:bg-foreground'} after:transition-transform after:duration-500 after:ease-out hover:after:scale-x-100 transition-all duration-500 ease-out hover:scale-105`}
                  onClick={() => navigate("/relaxing-corner")}
                >
                  RELAXING CORNER
                </Button>
              </nav>
            </div>

            {/* Centered logo (desktop/tablet) */}
            <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <Button
                variant="ghost"
                className={`p-0 h-auto hover:!bg-transparent select-none cursor-pointer transition-all duration-500 ease-out hover:scale-110`}
                onClick={() => navigate("/")}
                aria-label="Home"
              >
                {headerVariant === 'transparent' ? (
                  <img src="/logo-white.svg" alt="Aryk logo" className="h-10 md:h-12 w-auto" />
                ) : (
                  <img src="/logo-dark.svg" alt="Aryk logo" className="h-10 md:h-12 w-auto" />
                )}
              </Button>
            </div>

            {/* Mobile centered logo - using absolute positioning for true centering */}
            <div className="md:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <Button
                variant="ghost"
                className={`p-0 h-auto hover:!bg-transparent select-none cursor-pointer transition-all duration-500 [transition-timing-function:cubic-bezier(0.25,0.46,0.45,0.94)]`}
                onClick={() => navigate("/")}
                aria-label="Home"
              >
                {headerVariant === 'transparent' ? (
                  <img src="/logo-white.svg" alt="Aryk logo" className="h-9 w-auto" />
                ) : (
                  <img src="/logo-dark.svg" alt="Aryk logo" className="h-9 w-auto" />
                )}
              </Button>
            </div>

            {/* Right: search underline + icons */}
            <div className="flex items-center gap-3 md:gap-4">
              <div className="hidden md:block w-72 lg:w-96">
                <div className="relative" ref={searchWrapRef}>
                  <Input
                    type="text"
                    placeholder="SEARCH"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    onKeyDown={handleKey}
                    className={`bg-transparent border-0 border-b ${headerVariant === 'transparent' ? 'border-white/70 text-white placeholder:text-white/70' : 'border-foreground/70 text-foreground placeholder:text-muted-foreground'} rounded-none pr-10 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all duration-500 ease-out focus:border-opacity-100 focus:scale-[1.02]`}
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {isLoading && <span className={`h-3 w-3 rounded-full border-2 border-current border-t-transparent animate-spin ${headerVariant === 'transparent' ? 'text-white/70' : 'text-muted-foreground'}`} />}
                    {searchQuery && (
                      <button
                        className={`${headerVariant === 'transparent' ? 'text-white/70 hover:text-white' : 'text-muted-foreground hover:text-foreground'} text-xs`}
                        aria-label="Clear"
                        onClick={() => { setSearchQuery(''); setSuggestions([]); setHighlighted(-1); }}
                      >
                        ✕
                      </button>
                    )}
                    <Search className={`h-4 w-4 transition-all duration-500 [transition-timing-function:cubic-bezier(0.25,0.46,0.45,0.94)] ${headerVariant === 'transparent' ? 'text-white/70' : 'text-muted-foreground'}`} />
                  </div>
                  {showSuggestions && suggestions.length > 0 && (
                    <div className={`absolute left-0 right-0 mt-2 rounded-xl border ${headerVariant === 'transparent' ? 'border-white/20 bg-black/60 text-white' : 'border-border bg-white text-foreground'} shadow-lg overflow-hidden z-50`}>
                      {suggestions.map((s, idx) => (
                        <button
                          key={s.id}
                          className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${idx === highlighted ? 'bg-muted/50' : 'hover:bg-muted/40'}`}
                          onMouseDown={(e) => { e.preventDefault(); }}
                          onMouseEnter={() => setHighlighted(idx)}
                          onClick={() => { navigate(`/product/${s.id}`); setShowSuggestions(false); setHighlighted(-1); }}
                        >
                          <img src={s.image || '/placeholder.svg'} alt={s.name} className="h-8 w-8 rounded object-cover" />
                          <span className="truncate">{s.name}</span>
                        </button>
                      ))}
                      <div className="border-t border-border/50" />
                      <button
                        className="w-full px-3 py-2 text-sm hover:bg-muted/40"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={submitSearch}
                      >
                        Search for “{searchQuery.trim()}”
                      </button>
                    </div>
                  )}
                  {showSuggestions && !isLoading && suggestions.length === 0 && (searchQuery ? (
                    <div className={`absolute left-0 right-0 mt-2 rounded-xl border ${headerVariant === 'transparent' ? 'border-white/20 bg-black/60 text-white' : 'border-border bg-white text-foreground'} shadow-lg overflow-hidden z-50`}>
                      <div className="px-3 py-2 text-sm">No results. Press Enter to search all.</div>
                    </div>
                  ) : recent.length > 0 ? (
                    <div className={`absolute left-0 right-0 mt-2 rounded-xl border ${headerVariant === 'transparent' ? 'border-white/20 bg-black/60 text-white' : 'border-border bg-white text-foreground'} shadow-lg overflow-hidden z-50`}>
                      {recent.map((q, idx) => (
                        <button
                          key={q+idx}
                          className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${idx === highlighted ? 'bg-muted/50' : 'hover:bg-muted/40'}`}
                          onMouseDown={(e) => e.preventDefault()}
                          onMouseEnter={() => setHighlighted(idx)}
                          onClick={() => { setSearchQuery(q); navigate(`/shopify-shop?q=${encodeURIComponent(q)}`); setShowSuggestions(false); setHighlighted(-1); }}
                        >
                          <Search className="h-4 w-4" />
                          <span className="truncate">{q}</span>
                        </button>
                      ))}
                      <div className="border-t border-border/50" />
                      <button
                        className="w-full px-3 py-2 text-xs text-muted-foreground hover:bg-muted/40"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => { setRecent([]); localStorage.removeItem('aryk_recent_searches'); }}
                      >
                        Clear recent searches
                      </button>
                    </div>
                  ) : null)}
                </div>
              </div>

              <div className="flex items-center gap-2">
               <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const domain = (import.meta as any).env?.VITE_SHOPIFY_STORE_DOMAIN;
                    if (domain) {
                       window.location.href = `https://${domain}/account`;                   
                    } else {
                      onAuthClick();
                    }
                  }}
                  className={`${headerVariant === 'transparent' ? 'text-white hover:text-white/90' : 'text-foreground hover:text-foreground/90'} hover:!bg-transparent transition-all duration-500 ease-out hover:scale-110 hover:shadow-md`}
                >
                  <User className="h-5 w-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className={`${headerVariant === 'transparent' ? 'text-white hover:text-white/90' : 'text-foreground hover:text-foreground/90'} hover:!bg-transparent transition-all duration-500 ease-out hover:scale-110 hover:shadow-md`}
                  onClick={() => navigate('/favorites')}
                >
                  <Heart className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onCartClick}
                  className={`relative ${headerVariant === 'transparent' ? 'text-white hover:text-white/90' : 'text-foreground hover:text-foreground/90'} hover:!bg-transparent transition-all duration-500 ease-out hover:scale-110 hover:shadow-md`}
                >
                  <ShoppingBag className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className={`absolute -top-1 -right-1 ${headerVariant === 'transparent' ? 'bg-white text-black' : 'bg-foreground text-background'} text-xs rounded-full h-5 w-5 flex items-center justify-center transition-all duration-500 ease-out animate-in zoom-in-50`}>
                      {cartCount}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile inline menu removed to prevent duplicate menus. Sidebar menu below remains. */}
        </div>
      </header>

      {/* Animated Sidebar Menu */}
      <div className={`fixed inset-0 z-50 transition-all duration-700 ease-out ${isMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-700 ease-out ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsMenuOpen(false)}
        />
        
        {/* Sidebar */}
        <div className={`absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl transform transition-all duration-700 ease-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-serif font-light text-foreground">Menu</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(false)}
              className="hover:bg-gray-100 transition-all duration-500 ease-out hover:scale-110 hover:shadow-md"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Sidebar Content */}
          <div className="p-6">
            <nav className="space-y-4">
              {/* Shop CTA */}
              <Button
                variant="ghost"
                className="md:hidden w-full justify-start h-12 text-sm font-medium uppercase tracking-wide hover:!bg-transparent relative after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-foreground after:transition-transform after:duration-500 after:ease-out hover:after:scale-x-100 transition-all duration-500 ease-out hover:scale-105"
                onClick={() => { navigate('/shopify-shop'); setIsMenuOpen(false); }}
              >
                SHOP
              </Button>

              {/* About */}
              <Button
                variant="ghost"
                className="w-full justify-start h-12 text-sm font-medium uppercase tracking-wide text-foreground hover:text-[#734c25] hover:!bg-transparent relative after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-[#734c25] after:transition-transform after:duration-500 after:ease-out hover:after:scale-x-100 transition-all duration-300 hover:scale-105"
                onClick={() => { navigate("/about"); setIsMenuOpen(false); }}
              >
                ABOUT US
              </Button>

              {/* Contact */}
              <Button
                variant="ghost"
                className="w-full justify-start h-12 text-sm font-medium uppercase tracking-wide text-foreground hover:text-[#734c25] hover:!bg-transparent relative after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-[#734c25] after:transition-transform after:duration-500 after:ease-out hover:after:scale-x-100 transition-all duration-300 hover:scale-105"
                onClick={() => { navigate("/contact"); setIsMenuOpen(false); }}
              >
                CONTACT US
              </Button>
            </nav>

            {/* Divider */}
            <div className="my-8 border-t" style={{ borderColor: '#734c25' }} />

            {/* Additional Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium uppercase tracking-wide" style={{ color: '#734c25' }}>Quick Links</h3>
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm font-medium uppercase tracking-wide text-foreground hover:text-[#734c25] hover:!bg-transparent relative after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-[#734c25] after:transition-transform after:duration-500 after:ease-out hover:after:scale-x-100 transition-all duration-300 hover:scale-105"
                  onClick={() => { navigate("/shopify-shop"); setIsMenuOpen(false); }}
                >
                  SHOP ALL PRODUCTS
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm font-medium uppercase tracking-wide text-foreground hover:text-[#734c25] hover:!bg-transparent relative after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-[#734c25] after:transition-transform after:duration-500 after:ease-out hover:after:scale-x-100 transition-all duration-300 hover:scale-105"
                  onClick={() => { navigate("/relaxing-corner"); setIsMenuOpen(false); }}
                >
                  RELAXING CORNER
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm font-medium uppercase tracking-wide text-foreground hover:text-[#734c25] hover:!bg-transparent relative after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-[#734c25] after:transition-transform after:duration-500 after:ease-out hover:after:scale-x-100 transition-all duration-300 hover:scale-105"
                  onClick={() => { navigate("/favorites"); setIsMenuOpen(false); }}
                >
                  MY FAVORITES
                </Button>
              </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="text-center">
                <p className="text-xs text-gray-400 mb-2">ARYK Organics</p>
                <p className="text-xs text-gray-400">Natural Beauty, Naturally You</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;

