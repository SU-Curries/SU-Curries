import React, { createContext, useState, useMemo, useEffect } from 'react';

type Theme = 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    // Set initial theme to dark and apply to document
    document.documentElement.classList.add('dark');
    document.body.style.backgroundColor = '#1a1a1a';
    document.body.style.color = '#ffffff';
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      document.documentElement.classList.remove(prevTheme);
      document.documentElement.classList.add(newTheme);
      
      // Apply body styles based on theme
      if (newTheme === 'dark') {
        document.body.style.backgroundColor = '#1a1a1a';
        document.body.style.color = '#ffffff';
      } else {
        document.body.style.backgroundColor = '#ffffff';
        document.body.style.color = '#000000';
      }
      
      return newTheme;
    });
  };

  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 