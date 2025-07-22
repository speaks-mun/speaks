"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { TopNavbar } from "./top-navbar"
import { BottomNavbar } from "./bottom-navbar"
import { HamburgerMenu } from "./hamburger-menu"

interface AppLayoutProps {
  children: React.ReactNode
  showBottomNav?: boolean
}

export function AppLayout({ children, showBottomNav = true }: AppLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMenuOpen])

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <TopNavbar onMenuToggle={() => setIsMenuOpen(true)} />

      {/* Hamburger Menu */}
      <HamburgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Main Content */}
      <main className={`pt-20 transition-all duration-300 ${showBottomNav ? "pb-20 md:pb-4" : "pb-4"}`}>
        <div className="px-4 md:px-6 lg:px-8">{children}</div>
      </main>

      {/* Bottom Navigation - Mobile Only */}
      {showBottomNav && <BottomNavbar />}
    </div>
  )
}
