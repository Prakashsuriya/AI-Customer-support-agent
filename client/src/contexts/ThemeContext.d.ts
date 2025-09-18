import { ReactNode } from 'react';

declare module '../contexts/ThemeContext' {
  interface ThemeContextType {
    darkMode: boolean;
    toggleDarkMode: () => void;
  }

  export const useTheme: () => ThemeContextType;
  export const ThemeProvider: ({ children }: { children: ReactNode }) => JSX.Element;
}
