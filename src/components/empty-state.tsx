import type React from "react"
import { Card, CardContent } from "@/components/ui/card"

interface EmptyStateProps {
  title: string
  subtitle: string
  icon?: React.ReactNode
  actionButtons?: React.ReactNode[]
}

export function EmptyState({ title, subtitle, icon, actionButtons }: EmptyStateProps) {
  return (
    <Card className="border-border-divider bg-card-background">
      <CardContent className="p-12 text-center">
        {icon && <div className="mb-6">{icon}</div>}
        <h3 className="text-xl font-semibold text-heading-text mb-3">{title}</h3>
        <p className="text-body-text mb-6 max-w-md mx-auto">{subtitle}</p>
        {actionButtons && actionButtons.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center">{actionButtons}</div>
        )}
      </CardContent>
    </Card>
  )
}
