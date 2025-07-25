import { useState, type ReactNode } from "react";
import LandingPageContext from "../contexts/LandingPageContext";

const LandingContextProvider = ({ children }: { children: ReactNode }) => {
  const [loaded, setLoaded] = useState<boolean>(true);
  return (
    <LandingPageContext.Provider value={{ loaded, setLoaded }}>
      {children}
    </LandingPageContext.Provider>
  );
};

export default LandingContextProvider;
