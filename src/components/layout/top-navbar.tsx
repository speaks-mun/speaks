"use client"

import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { NotificationBell } from "@/components/notifications/notification-bell"

interface TopNavbarProps {
  onMenuToggle?: () => void
}

export function TopNavbar({ onMenuToggle }: TopNavbarProps) {
  const pathname = usePathname()

  const navigationItems = [
    { href: "/discover", label: "Discover" },
    { href: "/my-events", label: "My Events" },
    { href: "/bookmarks", label: "Bookmarks" },
    { href: "/profile", label: "Profile" },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full backdrop-blur-md bg-card-background/80 border-b border-border-divider transition-all duration-300">
      <div className="px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <img
              src="/speaks-logo.jpg" // make sure your file is in /public
              alt="Speaks Logo"
              className="h-8 w-auto transition-transform group-hover:scale-105"
            />
            <span className="text-xl font-bold text-heading-text">Speaks</span>
          </Link>

          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map(({ href, label }) => (
              <Link key={href} href={href}>
                <Button
                  variant="ghost"
                  className={`transition-all duration-200 ${
                    isActive(href)
                      ? "text-primary-cta font-semibold bg-primary-cta/10"
                      : "text-body-text hover:text-heading-text hover:bg-card-background/50"
                  }`}
                >
                  {label}
                </Button>
              </Link>
            ))}
          </div>

          {/* Notification Bell */}
          <NotificationBell />

          {/* Hamburger Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuToggle}
            className="text-heading-text hover:bg-card-background/50 transition-all duration-200 focus:ring-2 focus:ring-primary-cta focus:ring-offset-2"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </nav>
  )
}
