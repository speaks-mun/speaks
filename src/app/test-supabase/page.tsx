"use client"

import { useState } from "react"
import { createClient } from "@supabase/supabase-js"

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function TestSupabasePage() {
  const [message, setMessage] = useState("")

  async function checkConnection() {
    setMessage("Testing connection...")
    const { data, error } = await supabase
      .from("Users") // your table name
      .select("*")
      .limit(1)

    if (error) {
      console.error("Supabase error:", error)
      setMessage(`❌ Supabase error: ${error.message}`)
    } else {
      console.log("Supabase data:", data)
      setMessage(`✅ Supabase is working! Found ${data.length} row(s)`)
    }
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Supabase Connection Test</h1>
      <button
        onClick={checkConnection}
        style={{
          padding: "0.5rem 1rem",
          background: "#4f46e5",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Test Supabase
      </button>
      {message && <p style={{ marginTop: "1rem" }}>{message}</p>}
    </div>
  )
}
