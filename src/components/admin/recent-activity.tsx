import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import type { AdminLog } from "@/lib/supabase/admin"

interface RecentActivityProps {
  logs: AdminLog[]
}

export function RecentActivity({ logs }: RecentActivityProps) {
  const getActionBadge = (action: string) => {
    switch (action) {
      case "approve_event":
        return <Badge variant="success">Approved Event</Badge>
      case "reject_event":
        return <Badge variant="destructive">Rejected Event</Badge>
      case "suspend_user":
        return <Badge variant="warning">Suspended User</Badge>
      case "ban_user":
        return <Badge variant="destructive">Banned User</Badge>
      case "promote_user":
        return <Badge variant="info">Promoted User</Badge>
      default:
        return <Badge variant="outline">{action.replace("_", " ").toUpperCase()}</Badge>
    }
  }

  const getActionDescription = (log: AdminLog) => {
    const details = log.details || {}
    switch (log.action) {
      case "approve_event":
        return `Approved event: ${details.event_title || "Unknown Event"}`
      case "reject_event":
        return `Rejected event: ${details.event_title || "Unknown Event"}${
          details.rejection_reason ? ` (Reason: ${details.rejection_reason})` : ""
        }`
      default:
        return `Performed action: ${log.action.replace("_", " ")}`
    }
  }

  if (logs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No recent admin activity</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {logs.map((log) => (
            <div key={log.id} className="flex items-start space-x-3">
              <div className="flex-1 space-y-1">
                <div className="flex items-center space-x-2">
                  {getActionBadge(log.action)}
                  <span className="text-sm text-muted-foreground">by {log.admin?.name || "Unknown Admin"}</span>
                </div>
                <p className="text-sm">{getActionDescription(log)}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
