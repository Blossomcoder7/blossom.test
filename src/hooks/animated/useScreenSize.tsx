import { useMediaQuery } from "@mui/material";

const useScreenSize = () => {
  const isMobile = useMediaQuery("(max-width: 600px)"); // Mobile
  const isTab = useMediaQuery("(min-width: 601px) and (max-width: 801px)"); // Tablet
  const isLgTab = useMediaQuery("(min-width: 801px) and (max-width: 1024px)"); // Tablet
  const isXl = useMediaQuery("(min-width: 1025px)"); // Large screens
  const is1Xl = useMediaQuery("(min-width: 1225px)"); // Large screens
  const is2Xl = useMediaQuery("(min-width: 1536px)"); // Large screens

  return {
    isMobile,
    isTab,
    isLgTab,
    isXl,
    is1Xl,
    is2Xl,
  };
};

export default useScreenSize;
