import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import CartSidebar from "@/components/CartSidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Heart, Star, ArrowLeft, Minus, Plus, Loader2 } from "lucide-react";
import { Product } from "@/lib/products";
import { ShopifyService } from "@/lib/shopifyService";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);
  const [wishlist, setWishlist] = useState<(number | string)[]>(() => {
    const saved = localStorage.getItem('aryk_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const { 
    cartItems, 
    isCartOpen, 
    setIsCartOpen, 
    updateCartQuantity, 
    removeFromCart, 
    getCartCount 
  } = useCart();

  useEffect(() => {
    localStorage.setItem('aryk_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (productId: number | string) => {
    setWishlist(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Fetch product details and suggestions
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        
        // Fetch all products to find the specific one and get suggestions
        const result = await ShopifyService.getProducts(50);
        const allProducts = result.products.map(ShopifyService.convertToProduct);
        
        // Find the specific product
        const foundProduct = allProducts.find(p => p.id.toString() === id);
        if (foundProduct) {
          setProduct(foundProduct);
          setActiveImageIdx(0);
          
          // Set default variant
          if (foundProduct.variants && foundProduct.variants.length > 0) {
            setSelectedVariant(foundProduct.variants[0].id);
          }
          
          // Get suggested products (same category, excluding current product)
          const suggestions = allProducts
            .filter(p => p.id !== foundProduct.id && p.category === foundProduct.category)
            .slice(0, 4);
          setSuggestedProducts(suggestions);
        } else {
          toast({
            title: "Product not found",
            description: "The product you're looking for doesn't exist.",
            variant: "destructive"
          });
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast({
          title: "Error",
          description: "Failed to load product details.",
          variant: "destructive"
        });
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductData();
    }
  }, [id, navigate, toast]);

  const { addToCart: addToCartViaContext } = useCart();

  const handleAddToCart = async (productArg?: any) => {
    const baseProduct = productArg || product;
    if (!baseProduct) return;
    try {
      // Find the appropriate variant ID
      let variantId = selectedVariant || baseProduct.variants?.find((v: any) => (v as any).availableForSale)?.id || baseProduct.variants?.[0]?.id;
      
      // If no variant found and we have a handle, fetch full product details
      if (!variantId && (baseProduct as any).handle) {
        try {
          const full = await ShopifyService.getProduct((baseProduct as any).handle);
          const edges = full?.variants?.edges || [];
          const availableEdge = edges.find((e: any) => e?.node?.availableForSale);
          variantId = availableEdge?.node?.id || edges[0]?.node?.id;
        } catch (err) {
          console.error('Error fetching product details:', err);
        }
      }
      
      if (!variantId) {
        toast({ title: "Error", description: "Product variant not available", variant: "destructive" });
        return;
      }

      // Use CartContext's addToCart which handles toast and proper state update
      await addToCartViaContext({
        id: String(variantId),
        name: baseProduct.name,
        category: baseProduct.category,
        price: baseProduct.price,
        image: baseProduct.image || '/placeholder.svg',
      }, quantity);
      
      setIsCartOpen(true);
    } catch (e) {
      toast({ title: "Error", description: "Failed to add to cart", variant: "destructive" });
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          onCartClick={() => setIsCartOpen(true)} 
          onAuthClick={() => {}} 
          cartCount={getCartCount()} 
          variant="solid" 
        />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading product details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          onCartClick={() => setIsCartOpen(true)} 
          onAuthClick={() => {}} 
          cartCount={getCartCount()} 
          variant="solid" 
        />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-serif font-light text-foreground mb-4">Product Not Found</h1>
          <Button onClick={() => navigate('/')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const isWishlisted = wishlist.includes(product.id);

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onCartClick={() => setIsCartOpen(true)} 
        onAuthClick={() => {}} 
        cartCount={getCartCount()} 
        variant="solid" 
      />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-2xl">
              <img
                src={(product.images && product.images[activeImageIdx]) || product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {(product.images && product.images.length > 1) && (
              <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory py-1 [-ms-overflow-style:none] [scrollbar-width:none]">
                <style>{`.container ::-webkit-scrollbar{display:none}`}</style>
                {(product.images as string[]).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative snap-start h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border ${activeImageIdx === idx ? 'border-foreground' : 'border-transparent'} transition-colors`}
                    aria-label={`View image ${idx + 1}`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            
            {/* Badges */}
            {product.badges && product.badges.length > 0 && (
              <div className="flex gap-2">
                {product.badges.map((badge, index) => (
                  <Badge key={index} variant="secondary">
                    {badge}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-serif font-light text-foreground mb-2">
                {product.name}
              </h1>
              <p className="text-muted-foreground uppercase tracking-wide">
                {product.category}
              </p>
            </div>

            {/* Rating removed */}

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-light text-foreground">
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-lg text-muted-foreground line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Variants */}
            {product.variants && product.variants.length > 1 && (
              <div>
                <h3 className="text-lg font-medium text-foreground mb-3">Size</h3>
                <div className="flex gap-2">
                  {product.variants.map((variant) => (
                    <Button
                      key={variant.id}
                      variant={selectedVariant === variant.id ? "default" : "outline"}
                      onClick={() => setSelectedVariant(variant.id)}
                      className="min-w-[60px]"
                    >
                      {variant.title}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-3">Quantity</h3>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-lg font-medium w-8 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= 10}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button 
                onClick={handleAddToCart}
                className="flex-1"
                size="lg"
              >
                Add to Cart
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => toggleWishlist(product.id)}
                className="h-12 w-12"
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
            </div>
          </div>
        </div>

        {/* Suggestions Section */}
        {suggestedProducts.length > 0 && (
          <div>
            <Separator className="mb-8" />
            <h2 className="text-2xl font-serif font-light text-foreground mb-8 text-center">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {suggestedProducts.map((suggestedProduct) => (
                <ProductCard
                  key={suggestedProduct.id}
                  {...suggestedProduct}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={toggleWishlist}
                  isWishlisted={wishlist.includes(suggestedProduct.id)}
                />
              ))}
            </div>
          </div>
        )}
      </main>

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
            // Redirect to sign in
            window.location.href = '/shopify-shop';
            return;
          }
          // Redirect to Shopify shop for checkout
          window.location.href = '/shopify-shop';
        }}
      />
    </div>
  );
};

export default ProductDetail;
