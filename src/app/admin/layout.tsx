import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { checkUserAdminStatus } from "@/lib/admin-actions"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Admin • Speaks",
  description: "Administrative dashboard for the Speaks platform",
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Redirects non-admins automatically.
  await checkUserAdminStatus()

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-background">{children}</div>
      </body>
    </html>
  )
}
