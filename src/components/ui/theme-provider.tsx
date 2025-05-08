
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { useTheme as useNextTheme } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

type Theme = "dark" | "light" | "system"

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

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

export const useTheme = (): ThemeProviderState => {
  // The error is happening here - we need to make sure we're in a client component
  // and the context is available when this hook is called
  const { theme, setTheme } = useNextTheme()
  
  return {
    theme: (theme as Theme) || "system",
    setTheme: setTheme as (theme: Theme) => void,
  }
}
