"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Bell, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  type: string
  title: string
  message: string
  is_read: boolean
  created_at: string
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)

  // Mock notifications for MVP
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: "1",
        type: "event_reminder",
        title: "Event Reminder",
        message: "Your event 'Chennai MUN Conference' starts in 2 hours!",
        is_read: false,
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      },
      {
        id: "2",
        type: "rsvp_confirmation",
        title: "RSVP Confirmed",
        message: "You've successfully RSVP'd to 'Tech Meetup'.",
        is_read: false,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      },
      {
        id: "3",
        type: "event_update",
        title: "Event Update",
        message: "'Music Fest' venue changed to Central Park.",
        is_read: true,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      },
      {
        id: "4",
        type: "follower_activity",
        title: "New Event",
        message: "User John created a new event: 'Art Exhibition'.",
        is_read: false,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
      },
    ]

    setNotifications(mockNotifications)
  }, [])

  const unreadCount = notifications.filter((n) => !n.is_read).length

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
  }

  const removeNotification = (notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "event_reminder":
        return "⏰"
      case "rsvp_confirmation":
        return "✅"
      case "event_update":
        return "📝"
      case "follower_activity":
        return "👥"
      default:
        return "🔔"
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="border-b border-border-divider p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-heading-text">Notifications</h3>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
                Mark all as read
              </Button>
            )}
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="mx-auto h-12 w-12 text-body-text mb-4" />
              <p className="text-body-text">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-border-divider">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-4 hover:bg-card-background/50 transition-colors cursor-pointer",
                    !notification.is_read && "bg-primary-cta/5",
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-lg">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-heading-text truncate">{notification.title}</p>
                        <div className="flex items-center space-x-1">
                          <span className="text-xs text-body-text">{formatTimeAgo(notification.created_at)}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeNotification(notification.id)
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-body-text mt-1">{notification.message}</p>
                      {!notification.is_read && (
                        <div className="flex items-center mt-2">
                          <div className="w-2 h-2 bg-primary-cta rounded-full mr-2" />
                          <span className="text-xs text-primary-cta">New</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
