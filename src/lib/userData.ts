// User-specific data management utilities
import { CartItem } from "@/contexts/CartContext";

export interface UserData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  shopifyAccessToken?: string;
  createdAt: string;
}

export interface WishlistItem {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  badges: string[];
  handle: string;
  description: string;
}

// Get user-specific storage key
const getUserStorageKey = (userId: string, dataType: 'cart' | 'wishlist' | 'user') => {
  return `aryk_${dataType}_${userId}`;
};

// Get current user from localStorage
export const getCurrentUser = (): UserData | null => {
  try {
    const userData = localStorage.getItem('aryk_user');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Save user data
export const saveUserData = (user: UserData): void => {
  try {
    localStorage.setItem('aryk_user', JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

// Get user-specific cart data
export const getUserCart = (userId: string): CartItem[] => {
  try {
    const cartKey = getUserStorageKey(userId, 'cart');
    const cartData = localStorage.getItem(cartKey);
    return cartData ? JSON.parse(cartData) : [];
  } catch (error) {
    console.error('Error getting user cart:', error);
    return [];
  }
};

// Save user-specific cart data
export const saveUserCart = (userId: string, cartItems: CartItem[]): void => {
  try {
    const cartKey = getUserStorageKey(userId, 'cart');
    localStorage.setItem(cartKey, JSON.stringify(cartItems));
  } catch (error) {
    console.error('Error saving user cart:', error);
  }
};

// Get user-specific wishlist data
export const getUserWishlist = (userId: string): WishlistItem[] => {
  try {
    const wishlistKey = getUserStorageKey(userId, 'wishlist');
    const wishlistData = localStorage.getItem(wishlistKey);
    return wishlistData ? JSON.parse(wishlistData) : [];
  } catch (error) {
    console.error('Error getting user wishlist:', error);
    return [];
  }
};

// Save user-specific wishlist data
export const saveUserWishlist = (userId: string, wishlistItems: WishlistItem[]): void => {
  try {
    const wishlistKey = getUserStorageKey(userId, 'wishlist');
    localStorage.setItem(wishlistKey, JSON.stringify(wishlistItems));
  } catch (error) {
    console.error('Error saving user wishlist:', error);
  }
};

// Migrate existing cart/wishlist data to user-specific storage
export const migrateUserData = (userId: string): void => {
  try {
    // Migrate cart data
    const globalCart = localStorage.getItem('aryk_cart');
    if (globalCart) {
      const cartItems = JSON.parse(globalCart);
      saveUserCart(userId, cartItems);
      // Keep global cart for backward compatibility
    }

    // Migrate wishlist data
    const globalWishlist = localStorage.getItem('aryk_wishlist');
    if (globalWishlist) {
      const wishlistItems = JSON.parse(globalWishlist);
      saveUserWishlist(userId, wishlistItems);
      // Keep global wishlist for backward compatibility
    }

    console.log('User data migration completed for user:', userId);
  } catch (error) {
    console.error('Error migrating user data:', error);
  }
};

// Clear user-specific data (for logout)
export const clearUserData = (userId: string): void => {
  try {
    const cartKey = getUserStorageKey(userId, 'cart');
    const wishlistKey = getUserStorageKey(userId, 'wishlist');
    
    localStorage.removeItem(cartKey);
    localStorage.removeItem(wishlistKey);
    localStorage.removeItem('aryk_user');
    
    console.log('User data cleared for user:', userId);
  } catch (error) {
    console.error('Error clearing user data:', error);
  }
};

// Get current user's cart (with fallback to global cart)
export const getCurrentUserCart = (): CartItem[] => {
  const user = getCurrentUser();
  if (user) {
    return getUserCart(user.id);
  }
  
  // Fallback to global cart
  try {
    const globalCart = localStorage.getItem('aryk_cart');
    return globalCart ? JSON.parse(globalCart) : [];
  } catch (error) {
    console.error('Error getting global cart:', error);
    return [];
  }
};

// Save current user's cart (with fallback to global cart)
export const saveCurrentUserCart = (cartItems: CartItem[]): void => {
  const user = getCurrentUser();
  if (user) {
    saveUserCart(user.id, cartItems);
  } else {
    // Fallback to global cart
    try {
      localStorage.setItem('aryk_cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving global cart:', error);
    }
  }
};

// Get current user's wishlist (with fallback to global wishlist)
export const getCurrentUserWishlist = (): WishlistItem[] => {
  const user = getCurrentUser();
  if (user) {
    return getUserWishlist(user.id);
  }
  
  // Fallback to global wishlist
  try {
    const globalWishlist = localStorage.getItem('aryk_wishlist');
    return globalWishlist ? JSON.parse(globalWishlist) : [];
  } catch (error) {
    console.error('Error getting global wishlist:', error);
    return [];
  }
};

// Save current user's wishlist (with fallback to global wishlist)
export const saveCurrentUserWishlist = (wishlistItems: WishlistItem[]): void => {
  const user = getCurrentUser();
  if (user) {
    saveUserWishlist(user.id, wishlistItems);
  } else {
    // Fallback to global wishlist
    try {
      localStorage.setItem('aryk_wishlist', JSON.stringify(wishlistItems));
    } catch (error) {
      console.error('Error saving global wishlist:', error);
    }
  }
};
