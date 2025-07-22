import { notFound } from "next/navigation"
import { getEventById } from "@/lib/supabase/admin"
import { EventReviewDialog } from "@/components/admin/event-review-dialog"

interface Props {
  params: { id: string }
}

export default async function EventReviewPage({ params }: Props) {
  const event = await getEventById(params.id)
  if (!event) return notFound()

  // Render a page that opens the review dialog immediately.
  // The dialog itself handles all actions client-side.
  return (
    <EventReviewDialog
      open={true}
      onOpenChange={() => {
        // When closed, navigate back to pending list.
        window.location.href = "/admin/pending-events"
      }}
      event={event}
    />
  )
}
