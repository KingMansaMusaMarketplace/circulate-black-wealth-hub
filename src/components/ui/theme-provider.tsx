
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { useTheme as useNextTheme } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export type Theme = "dark" | "light" | "system"

export type ThemeProviderState = {
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

// Re-export useTheme from next-themes
export const useTheme = useNextTheme;
