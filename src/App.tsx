import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { useEffect } from "react";
import { handleCheckoutReturn } from "@/lib/checkoutUtils";
import Index from "./pages/Index";
import ComingSoon from "./pages/ComingSoon";
import RelaxingCorner from "./pages/RelaxingCorner";
import NotFound from "./pages/NotFound";
import Favorites from "./pages/Favorites";
// Removed legacy Shop page in favor of ShopifyShop
import ShopifyShop from "./pages/ShopifyShop";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Profile from "./pages/Profile";
import ProductDetail from "./pages/ProductDetail";
import ScrollToTopOnRoute from "@/components/ScrollToTopOnRoute";

const queryClient = new QueryClient();

const App = () => {
  // Handle checkout completion globally
  useEffect(() => {
    handleCheckoutReturn();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTopOnRoute />
            <Routes>
              <Route path="/" element={<ComingSoon />} />
              <Route path="/shop" element={<ShopifyShop />} />
              <Route path="/shopify-shop" element={<ShopifyShop />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/relaxing-corner" element={<RelaxingCorner />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/profile" element={<Profile />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
