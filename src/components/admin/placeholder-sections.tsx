import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Users,
  Shield,
  BarChart3,
  Settings,
  Search,
  UserX,
  Ban,
  KeyRound,
  CheckCircle,
  UserPlus,
  UserMinus,
  Flag,
  FileText,
  Zap,
  Wrench,
  Mail,
  FolderOpen,
} from "lucide-react"

export function UserManagementSection() {
  const userActions = [
    { icon: Search, label: "Search Users", description: "Find and filter users" },
    { icon: UserX, label: "Suspend Account", description: "Temporarily suspend user access" },
    { icon: Ban, label: "Ban User", description: "Permanently ban user from platform" },
    { icon: KeyRound, label: "Reset Password", description: "Force password reset for user" },
    { icon: CheckCircle, label: "Verify Account", description: "Manually verify user account" },
    { icon: UserPlus, label: "Promote to Admin", description: "Grant admin privileges" },
    { icon: UserMinus, label: "Demote to User", description: "Remove admin privileges" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5" />
          <span>User Management</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2">
          {userActions.map((action) => {
            const Icon = action.icon
            return (
              <Button
                key={action.label}
                variant="outline"
                disabled
                className="justify-start h-auto p-3 opacity-50 bg-transparent"
              >
                <div className="flex items-start space-x-3">
                  <Icon className="h-4 w-4 mt-0.5" />
                  <div className="text-left">
                    <div className="font-medium">{action.label}</div>
                    <div className="text-xs text-muted-foreground">{action.description}</div>
                  </div>
                </div>
              </Button>
            )
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          User management features will be available in a future update.
        </p>
      </CardContent>
    </Card>
  )
}

export function AnalyticsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5" />
          <span>Platform Analytics</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center py-8">
            <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2">Detailed Analytics Coming Soon</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Comprehensive analytics charts and insights will be available here.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• User engagement metrics</p>
              <p>• Event performance analytics</p>
              <p>• Platform growth statistics</p>
              <p>• Automated reporting system</p>
            </div>
          </div>
          <Button variant="outline" disabled className="w-full opacity-50 bg-transparent">
            Configure Reports
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function SystemManagementSection() {
  const systemActions = [
    { icon: Flag, label: "Feature Flags", description: "Toggle platform features" },
    { icon: FileText, label: "Content Policies", description: "Manage content moderation rules" },
    { icon: Zap, label: "Rate Limiting", description: "Configure API rate limits" },
    { icon: Wrench, label: "Maintenance Mode", description: "Enable/disable maintenance mode" },
    { icon: Mail, label: "Email Templates", description: "Customize notification emails" },
    { icon: FolderOpen, label: "Category Management", description: "Manage event categories" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="h-5 w-5" />
          <span>System Management</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2">
          {systemActions.map((action) => {
            const Icon = action.icon
            return (
              <Button
                key={action.label}
                variant="outline"
                disabled
                className="justify-start h-auto p-3 opacity-50 bg-transparent"
              >
                <div className="flex items-start space-x-3">
                  <Icon className="h-4 w-4 mt-0.5" />
                  <div className="text-left">
                    <div className="font-medium">{action.label}</div>
                    <div className="text-xs text-muted-foreground">{action.description}</div>
                  </div>
                </div>
              </Button>
            )
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          System management tools will be available in a future update.
        </p>
      </CardContent>
    </Card>
  )
}

export function SecurityComplianceSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-5 w-5" />
          <span>Security & Compliance</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-800 mb-2">Current Security Status</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>✓ Supabase Row Level Security (RLS) enabled</li>
              <li>✓ Admin action logging implemented</li>
              <li>✓ Role-based access control active</li>
              <li>✓ Secure authentication flow</li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">MVP Scope</h4>
            <p className="text-sm text-blue-700 mb-2">For the MVP version, security focuses on:</p>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Robust database security with RLS policies</li>
              <li>• Basic admin action logging and audit trails</li>
              <li>• Secure user authentication and authorization</li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">Future Enhancements</h4>
            <p className="text-sm text-yellow-700 mb-2">Advanced security features planned:</p>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Login attempt monitoring</li>
              <li>• Suspicious activity detection</li>
              <li>• User data export tools</li>
              <li>• Right to erasure compliance</li>
              <li>• Advanced audit logging</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
