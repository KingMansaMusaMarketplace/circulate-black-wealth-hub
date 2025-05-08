
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

type Theme = "dark" | "light" | "system"

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

// Export the ThemeProvider correctly
export function ThemeProvider({ 
  children, 
  defaultTheme = "system", 
  ...props 
}: ThemeProviderProps) {
  return (
    <NextThemesProvider defaultTheme={defaultTheme} {...props}>
      {children}
    </NextThemesProvider>
  )
}

// Export hook for theme usage
export const useTheme = () => {
  const { theme, setTheme } = React.useContext(
    React.createContext<{ theme: string | undefined; setTheme: (theme: string) => void}>({
      theme: undefined,
      setTheme: () => {},
    })
  );
  
  return {
    theme: theme as Theme,
    setTheme: setTheme as (theme: Theme) => void,
  };
}
