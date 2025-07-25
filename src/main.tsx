import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import RenderWithSuspense from "./components/wrappers/RenderWithSuspense";

const App = React.lazy(() => import("./App"));

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RenderWithSuspense>
      <App />
    </RenderWithSuspense>
  </StrictMode>
);
