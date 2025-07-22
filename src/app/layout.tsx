import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Speaks - MUN Event Discovery Platform",
  description: "Discover and create Model United Nations events in the South Indian circuit",
  keywords: ["MUN", "Model United Nations", "Events", "South India", "Debate", "Conference"],
  authors: [{ name: "Speaks Team" }],
  creator: "Speaks Platform",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://speaks-platform.vercel.app",
    title: "Speaks - MUN Event Discovery Platform",
    description: "Discover and create Model United Nations events in the South Indian circuit",
    siteName: "Speaks",
  },
  twitter: {
    card: "summary_large_image",
    title: "Speaks - MUN Event Discovery Platform",
    description: "Discover and create Model United Nations events in the South Indian circuit",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {/* Global background with subtle overlay */}
          <div className="bg-background relative min-h-screen">
            <div className="absolute inset-0 bg-black opacity-5 dark:opacity-10" />

            {/* Main application content */}
            <div className="relative z-10">{children}</div>

            {/* Global toast notifications */}
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
