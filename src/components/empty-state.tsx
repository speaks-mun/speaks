import type React from "react"

interface EmptyStateProps {
  title: string
  subtitle: string
  icon?: React.ReactNode
  actionButtons?: React.ReactNode[]
}

export function EmptyState() {
  return null
}
