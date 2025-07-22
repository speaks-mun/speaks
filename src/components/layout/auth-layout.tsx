"use client"

import type React from "react"
import { useTheme } from "next-themes"
import { Switch } from "@/components/ui/switch"
import { Sun, Moon } from "lucide-react"

interface AuthLayoutProps {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const { theme, setTheme } = useTheme()

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative">
      {/* Theme Toggle - Fixed position */}
      <div className="absolute top-4 right-4 z-10">
        <div className="flex items-center space-x-2 bg-card-background/80 backdrop-blur-sm border border-border-divider rounded-lg px-3 py-2">
          <Sun className="h-4 w-4 text-body-text" />
          <Switch
            checked={theme === "dark"}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            aria-label="Toggle theme"
            className="data-[state=checked]:bg-primary-cta"
          />
          <Moon className="h-4 w-4 text-body-text" />
        </div>
      </div>

      {/* Centered content */}
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}
