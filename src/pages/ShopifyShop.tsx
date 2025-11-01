import { useState, useMemo, useEffect } from "react";
import { useShopifyProducts, useShopifyCart } from "@/hooks/useShopify";
import { ShopifyService } from "@/lib/shopifyService";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import CartSidebar from "@/components/CartSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Grid, List, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { markCheckoutInitiated } from "@/lib/checkoutUtils";

const ShopifyShop = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  // Global cart context
  const { 
    cartItems: globalCartItems, 
    isCartOpen, 
    setIsCartOpen, 
    getCartCount 
  } = useCart();

  // Shopify hooks
  const { products, loading, error, pageInfo, refetch } = useShopifyProducts(50);
  const { 
    cart, 
    addToCart, 
    updateCartItem, 
    removeFromCart, 
    getCartItemCount, 
    getCartTotal 
  } = useShopifyCart();

  // Load user from localStorage on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('aryk_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Read query param q to prefill search
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q) setSearchQuery(q);
  }, []);

  // Get unique categories from Shopify product types and tags
  const categories = useMemo(() => {
    const set = new Set<string>();
    set.add('all');
    for (const p of products) {
      const type = (p.category || '').trim().toUpperCase();
      if (type) set.add(type);
      if (p.tags && p.tags.length) {
        for (const tag of p.tags) {
          const t = (tag || '').trim().toUpperCase();
          if (t) set.add(t);
        }
      }
    }
    return Array.from(set);
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (product.category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (product.tags || []).some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const normalizedCategory = (product.category || '').trim().toUpperCase();
      const hasTag = (product.tags || []).some(t => (t || '').trim().toUpperCase() === selectedCategory);
      const matchesCategory = selectedCategory === "all" || normalizedCategory === selectedCategory || hasTag;
      return matchesSearch && matchesCategory;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [products, searchQuery, selectedCategory, sortBy]);

  const handleAddToCart = async (product: any) => {
    try {
      // Prefer first available-for-sale variant, then any
      let variantId = product.variants?.find((v: any) => v.availableForSale)?.id || product.variants?.[0]?.id;

      // Fallback: fetch full product from Shopify to get variant ID
      if (!variantId && product.handle) {
        try {
          const full = await ShopifyService.getProduct(product.handle);
          // Try to get first available variant from raw response
          const edges = full?.variants?.edges || [];
          const availableEdge = edges.find((e: any) => e?.node?.availableForSale);
          variantId = availableEdge?.node?.id || edges[0]?.node?.id;
        } catch (e) {
          // ignore, will show error below
        }
      }

      if (!variantId) {
        toast({
          title: "Error",
          description: "Product variant not available",
          variant: "destructive",
        });
        return;
      }

      await addToCart(variantId, 1);
      toast({ title: "Added to cart", description: "Item has been added to your cart." });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({ title: "Error", description: "Failed to add to cart", variant: "destructive" });
    }
  };

  const handleUpdateCartQuantity = async (lineId: string, quantity: number) => {
    if (quantity === 0) {
      await removeFromCart(lineId);
      return;
    }
    
    await updateCartItem(lineId, quantity);
  };

  const handleRemoveFromCart = async (lineId: string) => {
    await removeFromCart(lineId);
  };

  const handleCheckout = async () => {
    const checkoutUrl = cart?.checkoutUrl;
    if (!checkoutUrl) {
      toast({ title: "Error", description: "No checkout URL available", variant: "destructive" });
      return;
    }
    if (cart?.id) {
      ShopifyService.attachCustomerToCart(cart.id).catch(() => {});
    }
    
    // Mark that checkout was initiated
    markCheckoutInitiated();
    
    // Add return URL parameter
    const returnUrl = encodeURIComponent(window.location.origin);
    const finalCheckoutUrl = checkoutUrl.includes('?') 
      ? `${checkoutUrl}&return_to=${returnUrl}`
      : `${checkoutUrl}?return_to=${returnUrl}`;
    
    window.location.href = finalCheckoutUrl;
  };

  const handleToggleWishlist = (productId: number) => {
    // TODO: Implement wishlist functionality
    toast({
      title: "Wishlist",
      description: "Wishlist functionality coming soon!",
    });
  };

  // Convert Shopify cart to our cart format for CartSidebar
  const cartItems = useMemo(() => {
    if (!cart) return [];
    
    return cart.lines.edges.map(edge => ({
      id: edge.node.id,
      name: edge.node.merchandise.product.title,
      category: edge.node.merchandise.product.title, // Use title as category for now
      price: parseFloat(edge.node.merchandise.price.amount),
      image: edge.node.merchandise.product.images.edges[0]?.node.url || '/placeholder.svg',
      quantity: edge.node.quantity,
      lineId: edge.node.id
    }));
  }, [cart]);

  if (error) {
    return (
      <div className="bg-background">
        <Header
          onCartClick={() => setIsCartOpen(true)}
          onAuthClick={() => setIsAuthModalOpen(true)}
          cartCount={getCartCount()}
          variant="solid"
        />
        <div className="pt-28 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-serif font-light text-foreground mb-4">
              Unable to load products
            </h2>
            <p className="text-muted-foreground mb-6">
              {error}
            </p>
            <Button onClick={refetch} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-background">
      <Header
        onCartClick={() => setIsCartOpen(true)}
        onAuthClick={() => setIsAuthModalOpen(true)}
        cartCount={getCartItemCount()}
        variant="solid"
      />
      
      <div className="pt-8 pb-6">
        {/* Page Header */}
        <div className="py-4 md:py-6">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-4xl font-serif font-light text-foreground mb-3">
              Shop
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl">
              Discover our complete collection of natural skincare essentials, carefully crafted to
              nourish and enhance your natural beauty.
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 mb-8">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11 h-12 rounded-xl bg-muted/30"
                />
              </div>
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full lg:w-48 h-12 rounded-xl bg-muted/30">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-48 h-12 rounded-xl bg-muted/30">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode */}
            <div className="inline-flex rounded-xl overflow-hidden border border-border">
              <Button
                variant="ghost"
                size="icon"
                className={`${viewMode === 'grid' ? 'bg-amber-900 text-white' : 'bg-muted/30 text-foreground'} h-12 w-12 rounded-none`}
                onClick={() => setViewMode("grid")}
                aria-pressed={viewMode === 'grid'}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`${viewMode === 'list' ? 'bg-amber-900 text-white' : 'bg-muted/30 text-foreground'} h-12 w-12 rounded-none`}
                onClick={() => setViewMode("list")}
                aria-pressed={viewMode === 'list'}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading products...</span>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <h1 className="text-4xl md:text-6xl font-serif font-light text-foreground mb-6 leading-tight">
                COMING SOON
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Our amazing products are on their way. Stay tuned for the launch!
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium text-muted-foreground mb-2">No products found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          ) : (
            <>
              <div className="mb-4 md:mb-6">
                <p className="text-sm md:text-base text-muted-foreground">
                  Showing {filteredProducts.length} of {products.length} products
                </p>
              </div>

              {viewMode === "grid" ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="w-full">
                      <ProductCard
                        {...product}
                        onAddToCart={handleAddToCart}
                        onToggleWishlist={handleToggleWishlist}
                        isWishlisted={false}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="w-full rounded-xl border border-border bg-card hover:shadow-md transition-all duration-300 ease-out p-3 sm:p-4"
                    >
                      <div className="flex gap-3 sm:gap-4 items-stretch">
                        {/* Image */}
                        <div className="relative h-24 w-24 sm:h-28 sm:w-28 flex-shrink-0 overflow-hidden rounded-lg">
                          <img
                            src={product.image || '/placeholder.svg'}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <h3 className="text-base sm:text-lg font-medium text-foreground truncate">
                              {product.name}
                            </h3>
                            <p className="text-xs sm:text-sm text-muted-foreground uppercase mt-0.5">
                              {(product.category || 'Product')}
                            </p>
                          </div>
                          <div className="mt-2 sm:mt-3 flex items-center gap-2">
                            <span className="text-base sm:text-lg font-medium text-foreground">₹{product.price.toLocaleString()}</span>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <span className="text-xs sm:text-sm text-muted-foreground line-through">₹{product.originalPrice.toLocaleString()}</span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col justify-center gap-2 sm:gap-3">
                          <button
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-full border border-black/20 bg-white px-4 h-9 sm:h-10 text-sm font-medium shadow-sm transition hover:shadow-md text-foreground hover:text-foreground"
                            onClick={() => handleAddToCart(product)}
                          >
                            Add to cart
                          </button>
                          <button
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-full border border-transparent bg-muted/50 px-4 h-9 sm:h-10 text-sm font-medium"
                            onClick={() => {
                              window.location.href = `/product/${product.id}`;
                            }}
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      <Footer />
      
      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={(userData) => {
          setUser(userData);
          setIsAuthModalOpen(false);
        }}
      />

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={async (id, quantity) => {
          if (quantity <= 0) {
            await removeFromCart(String(id));
            return;
          }
          await updateCartItem(String(id), quantity);
        }}
        onRemoveItem={async (id) => {
          await removeFromCart(String(id));
        }}
        onCheckout={handleCheckout}
      />
    </div>
  );
};

export default ShopifyShop;
