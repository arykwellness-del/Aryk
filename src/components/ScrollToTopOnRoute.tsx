import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTopOnRoute = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Always scroll to top on route change
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);

  return null;
};

export default ScrollToTopOnRoute;


