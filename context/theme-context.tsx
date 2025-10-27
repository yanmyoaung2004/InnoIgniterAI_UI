"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ThemeMode } from "@/lib/types";
import { THEME_MEDIA_QUERY, THEME_STORAGE_KEY } from "@/lib/utils";

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Get theme from localStorage
    const stored = (localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode) ?? "system";
    setTheme(stored);
    
    // Apply theme immediately
    applyThemeToDocument(stored);
  }, []);

  const applyThemeToDocument = (newTheme: ThemeMode) => {
    try {
      const doc = document.documentElement;
      doc.classList.remove("dark", "light");
      
      if (newTheme === "system") {
        if (window.matchMedia(THEME_MEDIA_QUERY).matches) {
          doc.classList.add("dark");
        } else {
          doc.classList.add("light");
        }
      } else {
        doc.classList.add(newTheme);
      }
      
    } catch (error) {
      console.error("Error applying theme:", error);
    }
  };

  const handleSetTheme = (newTheme: ThemeMode) => {
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    setTheme(newTheme);
    applyThemeToDocument(newTheme);
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
