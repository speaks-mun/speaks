import type React from "react"
import { Suspense } from "react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <Suspense
        fallback={
          <div className="max-w-7xl mx-auto p-4">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-1/4" />
              <div className="h-4 bg-muted rounded w-1/2" />
              <div className="grid gap-4 md:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-32 bg-muted rounded" />
                ))}
              </div>
            </div>
          </div>
        }
      >
        {children}
      </Suspense>
    </div>
  )
}
