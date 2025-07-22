import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, Heart, CheckCircle, Clock, TrendingUp } from "lucide-react"
import type { AdminStats } from "@/lib/supabase/admin"

interface AdminStatsCardsProps {
  stats: AdminStats
}

export function AdminStatsCards({ stats }: AdminStatsCardsProps) {
  const statsConfig = [
    {
      title: "Pending Events",
      value: stats.pending_events,
      icon: Clock,
      description: "Events awaiting review",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Total Users",
      value: stats.total_users,
      icon: Users,
      description: "Registered users",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Events",
      value: stats.total_events,
      icon: Calendar,
      description: "All events created",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Active Events",
      value: stats.active_events,
      icon: TrendingUp,
      description: "Live upcoming events",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Total RSVPs",
      value: stats.total_rsvps,
      icon: CheckCircle,
      description: "Event registrations",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      title: "Total Bookmarks",
      value: stats.total_bookmarks,
      icon: Heart,
      description: "Events bookmarked",
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {statsConfig.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`rounded-full p-2 ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
