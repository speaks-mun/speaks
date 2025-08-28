// import type React from "react"
// import { createClient } from "@/lib/supabase/server"
// import { redirect } from "next/navigation"
// import { AppLayout } from "@/components/layout/app-layout"

// export default async function AppLayoutWrapper({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   // Check authentication status
//   const supabase = createClient()
//   const {
//     data: { user },
//   } = await supabase.auth.getUser()

//   if (!user) {
//     redirect("/auth/login")
//   }

//   return <AppLayout>{children}</AppLayout>
// }



import type React from "react"
import { AppLayout } from "@/components/layout/app-layout"

export default async function AppLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  // 🔓 Make all pages public (no auth check for now)
  return <AppLayout>{children}</AppLayout>
}
