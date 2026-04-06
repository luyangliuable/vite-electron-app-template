import { HashRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Settings from "./pages/Settings";
import FeaturePageLayout from "./components/FeaturePageLayout";

import React, { useMemo } from "react";
import Context from "./store/context";
import { ThemeProvider } from "./contexts/ThemeContext";
import { MenuActionsProvider } from "./components/MenuActionsProvider";
import "./styles/theme.css";

function App(): JSX.Element {
  const contextValue = useMemo(() => ({ name: "Ant Design" }), []);

  return (
    <ThemeProvider>
      <Context.Provider value={contextValue}>
        <HashRouter>
          <MenuActionsProvider>
            <div id="container" className="h-screen w-screen flex">
              <Routes>
                <Route index element={<HomePage />} />
                <Route element={<FeaturePageLayout />}>
                  <Route path="/settings" element={<Settings />} />
                </Route>
              </Routes>
            </div>
          </MenuActionsProvider>
        </HashRouter>
      </Context.Provider>
    </ThemeProvider>
  );
}

export default App;
