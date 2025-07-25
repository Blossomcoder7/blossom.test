"use client"

import { useContext } from "react";
import LandingPageContext from "../LandingPageContext";

const useGetLandingLoadedStatus = () => {
  const context = useContext(LandingPageContext);
  if (!context) {
    throw new Error("Please use The Status Only inside provider");
  } else return context;
};
export default useGetLandingLoadedStatus ;