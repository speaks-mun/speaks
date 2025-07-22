"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Facebook, Twitter, Linkedin, Mail, MessageCircle, QrCode } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Event {
  id: string
  title: string
  description: string
}

interface ShareEventDialogProps {
  event: Event
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ShareEventDialog({ event, open, onOpenChange }: ShareEventDialogProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const eventUrl = `${window.location.origin}/events/${event.id}`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(eventUrl)
      setCopied(true)
      toast({
        title: "Link copied!",
        description: "Event link has been copied to your clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Event</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm mb-2">Event Link</h4>
            <div className="flex gap-2">
              <Input value={eventUrl} readOnly className="flex-1" />
              <Button onClick={handleCopyLink} variant="outline">
                <Copy className="h-4 w-4 mr-2" />
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-sm mb-3">Share on Social Media</h4>
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" disabled className="flex flex-col gap-1 h-auto py-3 bg-transparent">
                <Facebook className="h-5 w-5" />
                <span className="text-xs">Facebook</span>
              </Button>
              <Button variant="outline" disabled className="flex flex-col gap-1 h-auto py-3 bg-transparent">
                <Twitter className="h-5 w-5" />
                <span className="text-xs">Twitter</span>
              </Button>
              <Button variant="outline" disabled className="flex flex-col gap-1 h-auto py-3 bg-transparent">
                <Linkedin className="h-5 w-5" />
                <span className="text-xs">LinkedIn</span>
              </Button>
              <Button variant="outline" disabled className="flex flex-col gap-1 h-auto py-3 bg-transparent">
                <Mail className="h-5 w-5" />
                <span className="text-xs">Email</span>
              </Button>
              <Button variant="outline" disabled className="flex flex-col gap-1 h-auto py-3 bg-transparent">
                <MessageCircle className="h-5 w-5" />
                <span className="text-xs">WhatsApp</span>
              </Button>
              <Button variant="outline" disabled className="flex flex-col gap-1 h-auto py-3 bg-transparent">
                <QrCode className="h-5 w-5" />
                <span className="text-xs">QR Code</span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
