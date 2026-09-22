import React, { createContext, useContext, useEffect } from 'react';

interface ThemeContextType {
  theme: 'light';
  isDarkMode: boolean;
  setTheme: (theme: any) => void;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  isDarkMode: false,
  setTheme: () => {},
  toggleDarkMode: () => {}
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Ensure pure light mode at all times
    const root = document.documentElement;
    root.classList.remove('dark');
    root.style.colorScheme = 'light';
    try {
      localStorage.removeItem('autoserv_theme');
      localStorage.setItem('autoserv_theme', 'light');
    } catch {}
  }, []);

  return (
    <ThemeContext.Provider value={{
      theme: 'light',
      isDarkMode: false,
      setTheme: () => {},
      toggleDarkMode: () => {}
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
