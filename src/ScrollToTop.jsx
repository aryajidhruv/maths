import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // This forces the window to the top-left corner
    window.scrollTo(0, 0);
  }, [pathname]); // This runs every time the URL path changes

  return null;
};

export default ScrollToTop;