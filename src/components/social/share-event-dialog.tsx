"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Facebook, Twitter, Linkedin, Mail, MessageCircle, QrCode } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Event } from "@/lib/supabase/events"

interface ShareEventDialogProps {
  event: Event
  isOpen: boolean
  onClose: () => void
}

export function ShareEventDialog({ event, isOpen, onClose }: ShareEventDialogProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const eventUrl = `${window.location.origin}/events/${event.id}`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(eventUrl)
      setCopied(true)
      toast({
        title: "Link copied!",
        description: "Event link has been copied to your clipboard.",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Event</DialogTitle>
          <DialogDescription>Share "{event.title}" with others</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Event URL */}
          <div className="space-y-2">
            <Label htmlFor="event-url">Event Link</Label>
            <div className="flex space-x-2">
              <Input id="event-url" value={eventUrl} readOnly className="flex-1" />
              <Button onClick={handleCopyLink} className="bg-primary-cta hover:bg-primary-cta/90">
                <Copy className="h-4 w-4 mr-2" />
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>

          {/* Social Media Buttons */}
          <div className="space-y-3">
            <Label>Share on social media</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" disabled className="justify-start bg-transparent">
                <Facebook className="h-4 w-4 mr-2 text-blue-600" />
                Facebook
              </Button>
              <Button variant="outline" disabled className="justify-start bg-transparent">
                <Twitter className="h-4 w-4 mr-2 text-blue-400" />
                Twitter
              </Button>
              <Button variant="outline" disabled className="justify-start bg-transparent">
                <Linkedin className="h-4 w-4 mr-2 text-blue-700" />
                LinkedIn
              </Button>
              <Button variant="outline" disabled className="justify-start bg-transparent">
                <MessageCircle className="h-4 w-4 mr-2 text-green-600" />
                WhatsApp
              </Button>
              <Button variant="outline" disabled className="justify-start bg-transparent">
                <Mail className="h-4 w-4 mr-2 text-gray-600" />
                Email
              </Button>
              <Button variant="outline" disabled className="justify-start bg-transparent">
                <QrCode className="h-4 w-4 mr-2 text-gray-600" />
                QR Code
              </Button>
            </div>
            <p className="text-xs text-body-text">Social sharing features coming soon!</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
