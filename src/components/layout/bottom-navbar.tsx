"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle, Heart, Compass, User, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function BottomNavbar() {
  const pathname = usePathname()

  const navigationItems = [
    { href: "/bookmarks", label: "Bookmarks", icon: Heart, showBadge: false },
    { href: "/profile", label: "Profile", icon: User, showBadge: false },
    { href: "/discover", label: "Discover", icon: Compass, showBadge: false, isCenter: true },
    { href: "/settings", label: "Settings", icon: Settings, showBadge: false },
    { href: "/create", label: "Create", icon: PlusCircle, showBadge: false },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 w-full bg-card-background/95 backdrop-blur-sm border-t border-border-divider md:hidden">
      <div className="flex items-center justify-around px-2 py-2 safe-area-pb">
        {navigationItems.map(({ href, label, icon: Icon, showBadge, isCenter }) => {
          if (isCenter) {
            // Central Discover button - larger and prominent
            return (
              <Link key={href} href={href} className="relative">
                <Button
                  variant="ghost"
                  className={`rounded-full w-14 h-14 shadow-lg flex items-center justify-center transition-all duration-200 focus:ring-2 focus:ring-primary-cta focus:ring-offset-2 ${
                    isActive(href)
                      ? "bg-primary-cta text-white scale-105"
                      : "bg-primary-cta hover:bg-primary-cta/90 text-white hover:scale-105"
                  }`}
                  aria-label={label}
                >
                  <Icon className="h-6 w-6" />
                </Button>
                {showBadge && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-card-background" />
                )}
              </Link>
            )
          }

          // Regular navigation items
          return (
            <Link key={href} href={href} className="relative">
              <Button
                variant="ghost"
                className={`flex flex-col items-center justify-center h-12 w-16 px-2 py-1 transition-all duration-200 focus:ring-2 focus:ring-primary-cta focus:ring-offset-2 ${
                  isActive(href)
                    ? "text-primary-cta font-semibold scale-105"
                    : "text-body-text hover:text-heading-text hover:scale-105"
                }`}
                aria-label={label}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs leading-none">{label}</span>
              </Button>
              {showBadge && <div className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full" />}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
