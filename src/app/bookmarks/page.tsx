import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"

export default async function BookmarksPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-heading-text mb-2">Bookmarks</h1>
          <p className="text-body-text">Your saved MUN events and conferences</p>
        </div>

        {/* Empty State */}
        <Card className="border-border-divider bg-card-background">
          <CardContent className="p-8 text-center">
            <Heart className="mx-auto h-12 w-12 text-body-text mb-4" />
            <h3 className="text-lg font-semibold text-heading-text mb-2">No bookmarks yet</h3>
            <p className="text-body-text mb-4">Save interesting MUN events to your bookmarks for easy access later.</p>
            <Button className="bg-primary-cta hover:bg-primary-cta/90 text-white">Discover Events</Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
