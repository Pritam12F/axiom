"use client"

import * as React from "react"

type Theme = "light" | "dark" | "system"

const ThemeContext = React.createContext<{ theme: Theme; setTheme: (t: Theme) => void } | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<Theme>("system")

  React.useEffect(() => {
    const root = document.documentElement
    root.classList.remove("light", "dark")
    if (theme !== "system") root.classList.add(theme)
  }, [theme])

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider")
  return ctx
}
