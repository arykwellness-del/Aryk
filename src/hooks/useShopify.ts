import { useState, useEffect, useCallback } from 'react';
import { ShopifyService, ShopifyProduct, ShopifyCart } from '@/lib/shopifyService';
import { Product } from '@/lib/products';
import { useToast } from '@/hooks/use-toast';
import { handleCheckoutReturn, CART_STORAGE_KEY } from '@/lib/checkoutUtils';

// Hook for fetching products
export const useShopifyProducts = (first: number = 20, after?: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageInfo, setPageInfo] = useState<any>(null);
  const { toast } = useToast();

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await ShopifyService.getProducts(first, after);
      const convertedProducts = response.products.map(ShopifyService.convertToProduct);
      
      setProducts(convertedProducts);
      setPageInfo(response.pageInfo);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [first, after, toast]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    pageInfo,
    refetch: fetchProducts
  };
};

// Hook for fetching a single product
export const useShopifyProduct = (handle: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProduct = useCallback(async () => {
    if (!handle) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await ShopifyService.getProduct(handle);
      const convertedProduct = ShopifyService.convertToProduct(response);
      
      setProduct(convertedProduct);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch product';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [handle, toast]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return {
    product,
    loading,
    error,
    refetch: fetchProduct
  };
};

// Hook for cart management
export const useShopifyCart = () => {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Load cart from localStorage on mount
  useEffect(() => {
    // Check if user returned from checkout and clear cart if so
    const checkoutCompleted = handleCheckoutReturn((message) => {
      toast({
        title: "Order Complete!",
        description: message,
      });
    });
    
    if (checkoutCompleted) {
      setCart(null);
      return;
    }

    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (err) {
        console.error('Error parsing saved cart:', err);
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    }
  }, [toast]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cart) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart]);

  const createCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const newCart = await ShopifyService.createCart();
      setCart(newCart);
      
      return newCart;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create cart';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const addToCart = useCallback(async (merchandiseId: string, quantity: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      let currentCart = cart;
      if (!currentCart) {
        currentCart = await createCart();
      }
      
      const updatedCart = await ShopifyService.addToCart(currentCart.id, [
        { merchandiseId, quantity }
      ]);
      
      setCart(updatedCart);
      
      toast({
        title: "Added to cart",
        description: "Item has been added to your cart.",
      });
      
      return updatedCart;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add to cart';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [cart, createCart, toast]);

  const updateCartItem = useCallback(async (lineId: string, quantity: number) => {
    if (!cart) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const updatedCart = await ShopifyService.updateCart(cart.id, [
        { id: lineId, quantity }
      ]);
      
      setCart(updatedCart);
      
      return updatedCart;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update cart';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [cart, toast]);

  const removeFromCart = useCallback(async (lineId: string) => {
    if (!cart) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const updatedCart = await ShopifyService.removeFromCart(cart.id, [lineId]);
      
      setCart(updatedCart);
      
      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart.",
      });
      
      return updatedCart;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove from cart';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [cart, toast]);

  const clearCart = useCallback(() => {
    setCart(null);
    localStorage.removeItem(CART_STORAGE_KEY);
  }, []);

  const getCartItemCount = useCallback(() => {
    return cart?.totalQuantity || 0;
  }, [cart]);

  const getCartTotal = useCallback(() => {
    if (!cart) return 0;
    return parseFloat(cart.cost.totalAmount.amount);
  }, [cart]);

  return {
    cart,
    loading,
    error,
    createCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartItemCount,
    getCartTotal
  };
};
