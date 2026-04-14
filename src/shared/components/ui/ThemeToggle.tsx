"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { cn } from "@/shared/lib/utils"

type Theme = "light" | "dark"

const STORAGE_KEY = "berliner-theme"

function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === "dark") {
    root.classList.add("dark")
  } else {
    root.classList.remove("dark")
  }
}

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<Theme | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    const initial = stored === "dark" ? "dark" : "light"
    applyTheme(initial)
    setTheme(initial)

    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return
      const next = event.newValue === "dark" ? "dark" : "light"
      applyTheme(next)
      setTheme(next)
    }

    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  const toggleTheme = () => {
    if (!theme) return
    const next = theme === "dark" ? "light" : "dark"
    localStorage.setItem(STORAGE_KEY, next)
    applyTheme(next)
    setTheme(next)
  }

  if (!theme) {
    return null
  }

  const isDark = theme === "dark"

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Activer le mode clair" : "Activer le mode sombre"}
      aria-pressed={isDark}
      className={cn(
        "inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold shadow-none transition-all hover:shadow-none active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:ring-offset-2 ring-offset-white dark:ring-offset-slate-950 dark:focus-visible:ring-slate-200",
        "bg-white/80 backdrop-blur-md text-slate-700 border-slate-200 hover:bg-white",
        "dark:bg-slate-900/80 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-900",
        className
      )}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      <span>{isDark ? "Mode clair" : "Mode sombre"}</span>
    </button>
  )
}
