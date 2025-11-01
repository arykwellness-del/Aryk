import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useShopifyCart } from '@/hooks/useShopify';

export interface CartItem {
  id: string | number;
  name: string;
  category: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Omit<CartItem, 'quantity'>, quantity?: number) => Promise<void> | void;
  updateCartQuantity: (id: string | number, quantity: number) => Promise<void> | void;
  removeFromCart: (id: string | number) => Promise<void> | void;
  clearCart: () => void;
  getCartCount: () => number;
  getCartTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { toast } = useToast();
  const {
    cart,
    addToCart: shopifyAddToCart,
    updateCartItem,
    removeFromCart: shopifyRemoveFromCart,
    clearCart: shopifyClearCart,
    getCartItemCount,
    getCartTotal: getShopifyCartTotal
  } = useShopifyCart();

  const cartItems = useMemo<CartItem[]>(() => {
    const edges = cart?.lines?.edges || [];
    const items = edges.map((edge: any) => ({
      id: edge.node.id,
      name: edge.node.merchandise?.product?.title,
      category: edge.node.merchandise?.product?.title,
      price: parseFloat(edge.node.merchandise?.price?.amount || '0'),
      image: edge.node.merchandise?.product?.images?.edges?.[0]?.node?.url || '/placeholder.svg',
      quantity: edge.node.quantity,
    }));
    return items;
  }, [cart]);

  const addToCart = async (product: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    try {
      const safeQuantity = Math.max(1, Math.floor(quantity));
      // We need a merchandise/variant id; try to accept product.id as variant id directly.
      await shopifyAddToCart(String(product.id), safeQuantity);
      // Show toast with product name
      toast({
        title: "Added to cart",
        description: `${product.name} x${safeQuantity} has been added to your cart.`,
      });
    } catch (e) {
      console.error('Error adding to cart:', e);
      toast({ title: "Error", description: "Failed to add to cart", variant: "destructive" });
    }
  };

  const updateCartQuantity = async (id: string | number, quantity: number) => {
    try {
      const safeQuantity = Math.max(0, Math.floor(quantity));
      if (safeQuantity <= 0) {
        await shopifyRemoveFromCart(String(id));
        return;
      }
      await updateCartItem(String(id), safeQuantity);
    } catch (e) {
      toast({ title: "Error", description: "Failed to update quantity", variant: "destructive" });
    }
  };

  const removeFromCart = async (id: string | number) => {
    try {
      await shopifyRemoveFromCart(String(id));
      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart.",
      });
    } catch (e) {
      toast({ title: "Error", description: "Failed to remove from cart", variant: "destructive" });
    }
  };

  const clearCart = () => {
    shopifyClearCart();
  };

  const getCartCount = () => {
    return getCartItemCount();
  };

  const getCartTotal = () => {
    return getShopifyCartTotal();
  };

  const value: CartContextType = {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    getCartCount,
    getCartTotal,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
