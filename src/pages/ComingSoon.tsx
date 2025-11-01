import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import CartSidebar from "@/components/CartSidebar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { useShopifyCart } from "@/hooks/useShopify";
import { ShopifyService } from "@/lib/shopifyService";
import { markCheckoutInitiated } from "@/lib/checkoutUtils";

const ComingSoon = () => {
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();
  const { isCartOpen, setIsCartOpen } = useCart();
  
  const { 
    cart, 
    addToCart: addToShopifyCart, 
    updateCartItem, 
    removeFromCart: removeFromShopifyCart, 
    getCartItemCount 
  } = useShopifyCart();

  useEffect(() => {
    const savedUser = localStorage.getItem('aryk_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleCheckout = async () => {
    const checkoutUrl = cart?.checkoutUrl;
    if (!checkoutUrl) {
      toast({ title: "Error", description: "No checkout URL available", variant: "destructive" });
      return;
    }
    if (cart?.id) {
      ShopifyService.attachCustomerToCart(cart.id).catch(() => {});
    }
    markCheckoutInitiated();
    const returnUrl = encodeURIComponent(window.location.origin);
    const finalCheckoutUrl = checkoutUrl.includes('?') 
      ? `${checkoutUrl}&return_to=${returnUrl}`
      : `${checkoutUrl}?return_to=${returnUrl}`;
    window.location.href = finalCheckoutUrl;
  };

  return (
    <div className="min-h-screen bg-background/50">
      <Header 
        onCartClick={() => setIsCartOpen(true)}
        onAuthClick={() => setIsAuthModalOpen(true)}
        cartCount={getCartItemCount()}
        variant="solid"
      />
      
      <div className="flex items-center justify-center min-h-screen pt-20">
        <div className="text-center max-w-4xl mx-auto px-4">
          <h1 className="text-6xl md:text-8xl font-serif font-light text-foreground mb-8 leading-tight">
            COMING SOON
          </h1>
          <h2 className="text-2xl md:text-4xl font-serif font-light text-muted-foreground mb-6">
            Experience self care like never before.
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Step into our community of like-minded souls and explore products made to celebrate you. Because you're the hero, and our products are your perfect sidekick.
          </p>
          <Button 
            size="lg" 
            className="bg-foreground text-background hover:bg-foreground/90 px-8 py-4 text-lg font-medium"
            onClick={() => navigate('/shopify-shop')}
          >
            Shop Now
          </Button>
        </div>
      </div>
      
      <Footer />

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
        items={(cart?.lines?.edges || []).map((edge: any) => ({
          id: edge.node.id,
          name: edge.node.merchandise.product.title,
          category: edge.node.merchandise.product.title,
          price: parseFloat(edge.node.merchandise.price.amount),
          image: edge.node.merchandise.product.images.edges[0]?.node.url || '/placeholder.svg',
          quantity: edge.node.quantity,
        }))}
        onUpdateQuantity={async (id, quantity) => {
          if (quantity <= 0) {
            await removeFromShopifyCart(String(id));
            return;
          }
          await updateCartItem(String(id), quantity);
        }}
        onRemoveItem={async (id) => {
          await removeFromShopifyCart(String(id));
        }}
        onCheckout={handleCheckout}
      />
    </div>
  );
};

export default ComingSoon;