"use client"
import type { ReactNode } from "react"
import { TopNavbar } from "./top-navbar"
import { BottomNavbar } from "./bottom-navbar"

interface MainLayoutProps {
  children: ReactNode
  showBottomNav?: boolean
}

export function MainLayout({ children, showBottomNav = true }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <TopNavbar />

      {/* Main content with proper spacing for fixed navbars */}
      <main className={`pt-20 ${showBottomNav ? "pb-20 md:pb-0" : ""}`}>{children}</main>

      {/* Bottom navigation - only shown on mobile */}
      {showBottomNav && <BottomNavbar />}
    </div>
  )
}
