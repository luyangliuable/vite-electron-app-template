import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type ThemeMode = "dark" | "light" | "system";

interface ThemeContextType {
  themeMode: ThemeMode;
  isDarkMode: boolean;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>("light");
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Function to get system preference
  const getSystemTheme = (): boolean => {
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false; // Default to light if can't detect
  };

  // Function to apply theme
  const applyTheme = (mode: ThemeMode) => {
    let shouldBeDark: boolean;

    switch (mode) {
      case "dark":
        shouldBeDark = true;
        break;
      case "light":
        shouldBeDark = false;
        break;
      case "system":
        shouldBeDark = getSystemTheme();
        break;
      default:
        shouldBeDark = false;
    }

    setIsDarkMode(shouldBeDark);
    document.documentElement.className = shouldBeDark
      ? "dark-theme"
      : "light-theme";
    document.body.className = shouldBeDark ? "dark-theme" : "light-theme";
  };

  // Set theme mode and apply it
  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem("viteElectronAppTemplate-theme-mode", mode);
    applyTheme(mode);
  };

  useEffect(() => {
    // Force light mode as default (clear any previous dark mode preference)
    const initialMode = "light";
    localStorage.setItem("viteElectronAppTemplate-theme-mode", "light");
    setThemeModeState(initialMode);
    applyTheme(initialMode);

    // Listen for system theme changes
    if (typeof window !== "undefined" && window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => {
        if (themeMode === "system") {
          applyTheme("system");
        }
      };

      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
    return undefined;
  }, []);

  useEffect(() => {
    // Re-apply theme when mode changes
    if (themeMode) {
      applyTheme(themeMode);
    }
  }, [themeMode]);

  return (
    <ThemeContext.Provider value={{ themeMode, isDarkMode, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
