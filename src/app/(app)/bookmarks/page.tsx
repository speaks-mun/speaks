import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import Link from "next/link"

export default function BookmarksPage() {
  return (
    <div className="container mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-heading-text mb-2">Bookmarks</h1>
        <p className="text-body-text">Your saved MUN events and conferences</p>
      </div>

      {/* Empty State */}
      <Card className="border-border-divider bg-card-background">
        <CardContent className="p-12 text-center">
          <Heart className="mx-auto h-16 w-16 text-body-text mb-6" />
          <h3 className="text-xl font-semibold text-heading-text mb-3">No bookmarks yet</h3>
          <p className="text-body-text mb-6 max-w-md mx-auto">
            Save interesting MUN events to your bookmarks for easy access later.
          </p>
          <Button className="bg-primary-cta hover:bg-primary-cta/90 text-white" asChild>
            <Link href="/discover">Discover Events</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
