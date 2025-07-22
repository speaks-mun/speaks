import { createClient } from "@/lib/supabase/server"

export default async function DiscoverPage() {
  const supabase = createClient()

  const { data: profiles } = await supabase.from("profiles").select(`
      id,
      username,
      avatar_url,
      updated_at
    `)

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">Discover</h1>
      {profiles && profiles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {profiles.map((profile) => (
            <div key={profile.id} className="bg-white rounded-lg shadow-md p-4">
              <img
                src={profile.avatar_url || "https://placehold.co/400x400"}
                alt={profile.username}
                className="w-full h-48 object-cover rounded-md mb-2"
              />
              <h2 className="text-xl font-semibold">{profile.username}</h2>
              <p className="text-gray-600">Updated: {profile.updated_at}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No profiles found.</p>
      )}
    </div>
  )
}
