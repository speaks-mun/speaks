import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function EventCardSkeleton() {
  return (
    <Card className="border-border-divider bg-card-background">
      {/* Header Background Skeleton */}
      <Skeleton className="h-48 w-full rounded-t-lg" />

      {/* Content Section */}
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Title Skeleton */}
          <Skeleton className="h-6 w-3/4" />

          {/* Date & Time Skeleton */}
          <div className="flex items-center space-x-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>

          {/* Venue Skeleton */}
          <Skeleton className="h-4 w-1/2" />

          {/* Tags Skeleton */}
          <div className="flex space-x-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-14" />
          </div>

          {/* Description Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>

        {/* Footer Actions Skeleton */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex -space-x-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-8 w-20" />
        </div>

        {/* Host Info Skeleton */}
        <div className="mt-3 flex items-center space-x-2 pt-3 border-t border-border-divider">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
      </CardContent>
    </Card>
  )
}
