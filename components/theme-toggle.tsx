'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { ThemeMode } from '@/lib/types';
import { THEME_MEDIA_QUERY, THEME_STORAGE_KEY } from '@/lib/utils';
import { useTheme } from '@/context/theme-context';

// Custom hook that provides fallback when ThemeProvider is not available
function useThemeSafe() {
  try {
    return useTheme();
  } catch (error) {
    // Fallback to local state management when context is not available
    const [theme, setTheme] = useState<ThemeMode>('system');
    
    useEffect(() => {
      const stored = (localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode) ?? 'system';
      setTheme(stored);
    }, []);
    
    const handleSetTheme = (newTheme: ThemeMode) => {
      applyTheme(newTheme);
      setTheme(newTheme);
    };
    
    return { theme, setTheme: handleSetTheme };
  }
}

const THEME_SCRIPT = `
  (function() {
    try {
      const doc = document.documentElement;
      const theme = localStorage.getItem("${THEME_STORAGE_KEY}") ?? "system";
      console.log('Theme script running, stored theme:', theme);
      
      if (theme === "system") {
        if (window.matchMedia("${THEME_MEDIA_QUERY}").matches) {
          doc.classList.add("dark");
          doc.classList.remove("light");
        } else {
          doc.classList.add("light");
          doc.classList.remove("dark");
        }
      } else {
        doc.classList.add(theme);
        doc.classList.remove(theme === "dark" ? "light" : "dark");
      }
    } catch (e) {
      console.error('Theme script error:', e);
    }
  })();
`
  .trim()
  .replace(/\n/g, '')
  .replace(/\s+/g, ' ');

function applyTheme(theme: ThemeMode) {
  try {
    const doc = document.documentElement;
    doc.classList.remove('dark', 'light');
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    console.log('Applying theme:', theme);

    if (theme === 'system') {
      if (window.matchMedia(THEME_MEDIA_QUERY).matches) {
        doc.classList.add('dark');
      } else {
        doc.classList.add('light');
      }
    } else {
      doc.classList.add(theme);
    }
  } catch (error) {
    console.error('Error applying theme:', error);
  }
}

export function ApplyThemeScript() {
  return <script id="theme-script" dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />;
}

export function ThemeToggle() {
  const { theme, setTheme } = useThemeSafe();

  const handleChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleChange('light')}>
          <Sun className="mr-2 h-4 w-4" /> Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleChange('dark')}>
          <Moon className="mr-2 h-4 w-4" /> Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleChange('system')}>
          <Monitor className="mr-2 h-4 w-4" /> System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
