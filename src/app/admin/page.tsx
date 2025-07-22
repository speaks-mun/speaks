import { Suspense } from "react"
import { getAdminStats, getRecentAdminLogs } from "@/lib/supabase/admin"
import { AdminStatsCards } from "@/components/admin/admin-stats-cards"
import { RecentActivity } from "@/components/admin/recent-activity"
import {
  UserManagementSection,
  AnalyticsSection,
  SystemManagementSection,
  SecurityComplianceSection,
} from "@/components/admin/placeholder-sections"

export default async function AdminDashboardPage() {
  const [stats, logs] = await Promise.all([getAdminStats(), getRecentAdminLogs(8)])

  return (
    <section className="max-w-7xl mx-auto p-4 space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
        <span className="text-sm font-medium text-green-600 bg-green-100 rounded px-3 py-1">Status: Online</span>
      </header>

      {stats && <AdminStatsCards stats={stats} />}

      <Suspense fallback={null}>{logs && <RecentActivity logs={logs} />}</Suspense>

      <UserManagementSection />
      <AnalyticsSection />
      <SystemManagementSection />
      <SecurityComplianceSection />
    </section>
  )
}
