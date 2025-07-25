import React from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import Layout from "./layouts/Layout";
import "./style/App.css";
import HomePage from "./pages/home/index/HomePage";
import LandingContextProvider from "./providers/LandingContextProvider";

const App = () => {
  return (
    <React.Fragment>
      <LandingContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </LandingContextProvider>
    </React.Fragment>
  );
};

export default App;
