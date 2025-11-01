import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import CartSidebar from "@/components/CartSidebar";
import { Product } from "@/lib/products";
import { ShopifyService } from "@/lib/shopifyService";
import { useCart } from "@/contexts/CartContext";
import { useShopifyCart } from "@/hooks/useShopify";
import { Loader2 } from "lucide-react";

const Favorites = () => {
  const [favorites, setFavorites] = useState<(number | string)[]>([]);
  const [shopifyProducts, setShopifyProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { 
    cartItems, 
    isCartOpen, 
    setIsCartOpen, 
    updateCartQuantity, 
    removeFromCart, 
    getCartCount 
  } = useCart();
  const { addToCart: addToShopifyCart } = useShopifyCart();

  useEffect(() => {
    const saved = localStorage.getItem("aryk_wishlist");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  // Fetch Shopify products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const result = await ShopifyService.getProducts(50); // Get more products for favorites
        const convertedProducts = result.products.map(ShopifyService.convertToProduct);
        setShopifyProducts(convertedProducts);
      } catch (error) {
        console.error('Error fetching Shopify products:', error);
        setShopifyProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const toggleWishlist = (productId: number | string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      localStorage.setItem('aryk_wishlist', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const favoriteProducts = shopifyProducts.filter((p) => favorites.includes(p.id));

  const handleAddToCart = async (product: Product) => {
    try {
      let variantId = product.variants?.find((v: any) => (v as any).availableForSale)?.id || product.variants?.[0]?.id;
      if (!variantId && (product as any).handle) {
        try {
          const full = await ShopifyService.getProduct((product as any).handle);
          const edges = full?.variants?.edges || [];
          const availableEdge = edges.find((e: any) => e?.node?.availableForSale);
          variantId = availableEdge?.node?.id || edges[0]?.node?.id;
        } catch {}
      }
      if (!variantId) return;
      await addToShopifyCart(String(variantId), 1);
    } catch (e) {
      // noop toast-less (Favorites page already minimal)
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onCartClick={() => setIsCartOpen(true)} 
        onAuthClick={() => {}} 
        cartCount={getCartCount()} 
        variant="solid" 
      />
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-serif font-light text-foreground mb-6">Your Favorites</h1>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading favorites...</span>
          </div>
        ) : favoriteProducts.length === 0 ? (
          <p className="text-muted-foreground">You haven't liked any products yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteProducts.map((p) => (
              <ProductCard
                key={p.id}
                {...p}
                onAddToCart={() => handleAddToCart(p)}
                onToggleWishlist={toggleWishlist}
                isWishlisted={true}
              />
            ))}
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

export default Favorites;


