/**
 * Utility functions for handling checkout completion detection
 */

export const CHECKOUT_STORAGE_KEY = 'aryk_checkout_initiated';
export const CART_STORAGE_KEY = 'aryk_shopify_cart';

/**
 * Mark that checkout process has been initiated
 */
export const markCheckoutInitiated = () => {
  localStorage.setItem(CHECKOUT_STORAGE_KEY, Date.now().toString());
};

/**
 * Check if user has returned from checkout and clear cart if so
 * Returns true if checkout was completed
 */
export const handleCheckoutReturn = (showSuccessMessage?: (message: string) => void): boolean => {
  const urlParams = new URLSearchParams(window.location.search);
  const checkoutInitiated = localStorage.getItem(CHECKOUT_STORAGE_KEY);
  
  // Check various indicators that user returned from checkout
  const checkoutComplete = 
    urlParams.get('checkout') === 'complete' || 
    urlParams.get('checkout_complete') === 'true' ||
    urlParams.get('order_status_url') !== null ||
    urlParams.get('thank_you') === 'true' ||
    checkoutInitiated !== null;
  
  if (checkoutComplete) {
    // Clear cart and checkout tracking
    localStorage.removeItem(CART_STORAGE_KEY);
    localStorage.removeItem(CHECKOUT_STORAGE_KEY);
    
    // Show success message if callback provided
    if (showSuccessMessage && checkoutInitiated) {
      showSuccessMessage('Thank you for your order! Your cart has been cleared.');
    }
    
    // Clean up URL parameters
    if (urlParams.has('checkout') || urlParams.has('checkout_complete') || 
        urlParams.has('order_status_url') || urlParams.has('thank_you')) {
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
    
    return true;
  }
  
  return false;
};

/**
 * Clear cart data (useful for manual cart clearing)
 */
export const clearCartData = () => {
  localStorage.removeItem(CART_STORAGE_KEY);
  localStorage.removeItem(CHECKOUT_STORAGE_KEY);
};