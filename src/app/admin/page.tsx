import { Suspense } from "react"
import { checkUserAdminStatus } from "@/lib/admin-actions"
import { getAdminStats, getRecentAdminLogs } from "@/lib/supabase/admin"
import { AdminStatsCards } from "@/components/admin/admin-stats-cards"
import { RecentActivity } from "@/components/admin/recent-activity"
import {
  UserManagementSection,
  AnalyticsSection,
  SystemManagementSection,
  SecurityComplianceSection,
} from "@/components/admin/placeholder-sections"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, Settings, Users, BarChart3 } from "lucide-react"
import Link from "next/link"

async function AdminDashboardContent() {
  await checkUserAdminStatus()

  const [stats, recentLogs] = await Promise.all([getAdminStats(), getRecentAdminLogs(10)])

  if (!stats) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Unable to load admin statistics</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center space-x-2 mt-2">
            <span className="text-muted-foreground">Status:</span>
            <Badge variant="success" className="bg-green-100 text-green-800">
              Online
            </Badge>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button asChild>
            <Link href="/admin/pending-events">
              <Settings className="h-4 w-4 mr-2" />
              Review Events
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <AdminStatsCards stats={stats} />

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button asChild variant="outline" className="h-auto p-4 bg-transparent">
              <Link href="/admin/pending-events">
                <div className="text-center">
                  <Settings className="h-6 w-6 mx-auto mb-2" />
                  <div className="font-medium">Review Events</div>
                  <div className="text-xs text-muted-foreground">{stats.pending_events} pending</div>
                </div>
              </Link>
            </Button>
            <Button variant="outline" disabled className="h-auto p-4 opacity-50 bg-transparent">
              <div className="text-center">
                <Users className="h-6 w-6 mx-auto mb-2" />
                <div className="font-medium">Manage Users</div>
                <div className="text-xs text-muted-foreground">Coming soon</div>
              </div>
            </Button>
            <Button variant="outline" disabled className="h-auto p-4 opacity-50 bg-transparent">
              <div className="text-center">
                <BarChart3 className="h-6 w-6 mx-auto mb-2" />
                <div className="font-medium">View Analytics</div>
                <div className="text-xs text-muted-foreground">Coming soon</div>
              </div>
            </Button>
            <Button variant="outline" disabled className="h-auto p-4 opacity-50 bg-transparent">
              <div className="text-center">
                <Shield className="h-6 w-6 mx-auto mb-2" />
                <div className="font-medium">Security Center</div>
                <div className="text-xs text-muted-foreground">Coming soon</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <RecentActivity logs={recentLogs} />

      {/* Management Sections */}
      <div className="grid gap-8 lg:grid-cols-2">
        <UserManagementSection />
        <AnalyticsSection />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <SystemManagementSection />
        <SecurityComplianceSection />
      </div>
    </div>
  )
}

export default function AdminDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto p-4">
      <Suspense
        fallback={
          <div className="space-y-8">
            <div className="h-8 bg-muted rounded animate-pulse" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded animate-pulse" />
              ))}
            </div>
          </div>
        }
      >
        <AdminDashboardContent />
      </Suspense>
    </div>
  )
}
