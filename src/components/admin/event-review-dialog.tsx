"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Tag, Clock, User } from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { approveEvent, rejectEvent } from "@/lib/admin-actions"
import type { PendingEvent } from "@/lib/supabase/admin"

interface EventReviewDialogProps {
  event: PendingEvent | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEventProcessed: () => void
}

export function EventReviewDialog({ event, open, onOpenChange, onEventProcessed }: EventReviewDialogProps) {
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  if (!event) return null

  const handleApprove = async () => {
    setIsProcessing(true)
    try {
      const result = await approveEvent(event.id)
      toast({
        title: "Event Approved",
        description: result.message,
      })
      onEventProcessed()
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to approve event",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Rejection Reason Required",
        description: "Please provide a reason for rejecting this event.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    try {
      const result = await rejectEvent(event.id, rejectionReason)
      toast({
        title: "Event Rejected",
        description: result.message,
      })
      onEventProcessed()
      onOpenChange(false)
      setShowRejectDialog(false)
      setRejectionReason("")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to reject event",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review Event</DialogTitle>
            <DialogDescription>Review the event details and decide whether to approve or reject it.</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Event Title */}
            <div>
              <h2 className="text-xl font-semibold">{event.title}</h2>
            </div>

            {/* Event Details Grid */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{format(new Date(event.date_time), "PPP 'at' p")}</span>
              </div>

              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{event.venue}</span>
              </div>

              <div className="flex items-center space-x-2 text-sm">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span>{event.category}</span>
              </div>

              {event.max_participants && (
                <div className="flex items-center space-x-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>Max {event.max_participants} participants</span>
                </div>
              )}

              <div className="flex items-center space-x-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>
                  {event.creator.name} ({event.creator.email})
                </span>
              </div>

              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Created {format(new Date(event.created_at), "PPP")}</span>
              </div>
            </div>

            {/* Tags */}
            {event.tags.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm whitespace-pre-wrap">{event.description}</p>
              </div>
            </div>

            {/* Additional Info */}
            {event.additional_info && (
              <div>
                <h4 className="font-medium mb-2">Additional Information</h4>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm whitespace-pre-wrap">{event.additional_info}</p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
              Close
            </Button>
            <Button variant="destructive" onClick={() => setShowRejectDialog(true)} disabled={isProcessing}>
              Reject Event
            </Button>
            <Button onClick={handleApprove} disabled={isProcessing}>
              {isProcessing ? "Processing..." : "Approve Event"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rejection Confirmation Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Event</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for rejecting this event. This will help the creator understand what needs to be
              improved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRejectionReason("")}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReject} disabled={isProcessing || !rejectionReason.trim()}>
              {isProcessing ? "Rejecting..." : "Reject Event"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
