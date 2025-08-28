// components/mun-pages/ColumbiaPage.tsx
import React from "react";

export default function ColumbiaPage() {
  return (
    <div className="bg-[#111] text-white min-h-screen">
      {/* Header */}
      <header className="flex items-center bg-black p-4">
        <img src="/5cb0f232-a897-4d8d-912b-86d8ebd85eb0.png" alt="Speaks Logo" className="h-10" />
      </header>

      {/* Hero Banner */}
      <div
        className="h-[300px] w-full bg-center bg-cover"
        style={{ backgroundImage: "url('/954f265d8c2db605226c0feb3c743eff.jpg')" }}
      ></div>

      {/* Event Container */}
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-2">Columbia Model United Nations</h1>
        <p>New York, USA</p>
        <p>October 02, 2025 – October 05, 2025</p>

        {/* Tabs */}
        <div className="flex justify-around border-b border-gray-700 my-6">
          {["Overview", "Committee", "Policy", "Organizer"].map((tab) => (
            <div key={tab} className="p-3 cursor-pointer hover:bg-[#222]">
              {tab}
            </div>
          ))}
        </div>

        {/* Overview */}
        <div className="bg-[#1a1a1a] p-4 rounded-lg leading-relaxed">
          Columbia Model United Nations (CMUN) is one of the leading academic
          simulations, bringing together students from around the globe to engage
          in diplomacy, policy debate, and global affairs in the spirit of the
          United Nations. Hosted at Columbia University, CMUN offers a diverse
          range of committees and fosters collaboration and leadership among
          participants.
        </div>

        {/* Info Section */}
        <div className="mt-6 bg-[#222] p-4 rounded-lg flex flex-wrap justify-between">
          <div className="m-2 text-sm">
            <div className="font-bold text-[#f5c518]">Key Information</div>
            <div>Delegate Fee: $150</div>
            <div>Hotel Fee: $150</div>
          </div>
          <div className="m-2 text-sm">
            <div className="font-bold text-[#f5c518]">Registration Deadline</div>
            <div>September 13, 2025</div>
          </div>
          <div className="m-2 text-sm">
            <div className="font-bold text-[#f5c518]">Location</div>
            <div>Columbia University Campus</div>
          </div>
        </div>
      </div>
    </div>
  );
}
