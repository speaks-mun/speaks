"use client"

import { useEffect } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { X, Home, CalendarDays, Heart, User, Settings, LogOut, Sun, Moon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "@/lib/auth-actions"

interface HamburgerMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function HamburgerMenu({ isOpen, onClose }: HamburgerMenuProps) {
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()

  // Handle keyboard navigation
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    const handleTab = (e: KeyboardEvent) => {
      if (!isOpen) return

      const focusableElements = document.querySelectorAll(
        '[data-menu-item="true"]:not([disabled]), [data-menu-close="true"]',
      )
      const firstElement = focusableElements[0] as HTMLElement
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement?.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement?.focus()
          }
        }
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.addEventListener("keydown", handleTab)

      // Focus first menu item when opened
      setTimeout(() => {
        const firstMenuItem = document.querySelector('[data-menu-item="true"]') as HTMLElement
        firstMenuItem?.focus()
      }, 100)
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.removeEventListener("keydown", handleTab)
    }
  }, [isOpen, onClose])

  const navigationItems = [
    { href: "/discover", label: "Discover", icon: Home },
    { href: "/my-events", label: "My Events", icon: CalendarDays },
    { href: "/bookmarks", label: "Bookmarks", icon: Heart },
    { href: "/profile", label: "Profile", icon: User },
    { href: "/settings", label: "Settings", icon: Settings },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out z-40 ${
          isOpen ? "opacity-40" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-card-background shadow-2xl z-50 transition-transform duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border-divider">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-cta rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold text-heading-text">Speaks</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              data-menu-close="true"
              className="focus:ring-2 focus:ring-primary-cta focus:ring-offset-2"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6">
            <div className="space-y-2">
              {navigationItems.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href} onClick={onClose}>
                  <Button
                    variant="ghost"
                    data-menu-item="true"
                    className={`w-full justify-start text-left h-12 px-4 transition-all duration-200 focus:ring-2 focus:ring-primary-cta focus:ring-offset-2 ${
                      isActive(href)
                        ? "bg-primary-cta/10 text-primary-cta font-semibold"
                        : "text-body-text hover:text-heading-text hover:bg-card-background/50"
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {label}
                  </Button>
                </Link>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-border-divider my-6" />

            {/* Logout */}
            <form action={signOut}>
              <Button
                type="submit"
                variant="ghost"
                data-menu-item="true"
                className="w-full justify-start text-left h-12 px-4 text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-200 focus:ring-2 focus:ring-destructive focus:ring-offset-2"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Logout
              </Button>
            </form>
          </nav>

          {/* Theme Toggle */}
          <div className="p-6 border-t border-border-divider">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {theme === "dark" ? (
                  <Moon className="h-5 w-5 text-body-text" />
                ) : (
                  <Sun className="h-5 w-5 text-body-text" />
                )}
                <span className="text-body-text font-medium">{theme === "dark" ? "Dark Mode" : "Light Mode"}</span>
              </div>
              <Switch
                checked={theme === "dark"}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                data-menu-item="true"
                className="focus:ring-2 focus:ring-primary-cta focus:ring-offset-2 data-[state=checked]:bg-primary-cta"
                aria-label="Toggle theme"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
