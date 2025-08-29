"use client";

import React from "react";

export default function YaleMUNPage() {
	return (
		<div className="bg-[#111] text-white min-h-screen font-sans">
			{/* Header */}
			<header className="flex items-center bg-black px-6 py-3">
				<img
					src="/speaks-logo.jpg"
					alt="Speaks Logo"
					className="h-10"
				/>
			</header>

			{/* Hero Banner */}
			<div
				className="h-[300px] w-full bg-center bg-cover"
				style={{
					backgroundImage: "url('/yale.jpg')",
				}}
			></div>

			{/* Event Container */}
			<div className="p-6">
				<h1 className="text-xl font-bold mb-2">
					Yale Model United Nations
				</h1>
				<p>New Haven, Connecticut</p>
				<p className="mb-6">October 20, 2025 – October 23, 2025</p>

				{/* Tabs */}
				<div className="flex justify-around border-b border-gray-700 mb-6">
					<button className="px-4 py-2 hover:bg-[#222]">
						Overview
					</button>
					<button className="px-4 py-2 hover:bg-[#222]">
						Committee
					</button>
					<button className="px-4 py-2 hover:bg-[#222]">
						Policy
					</button>
					<button className="px-4 py-2 hover:bg-[#222]">
						Organizer
					</button>
				</div>

				{/* Overview */}
				<div className="bg-[#1a1a1a] p-4 rounded-lg leading-relaxed">
					Yale Model United Nations (YMUN) is one of the most
					prestigious MUN conferences. Staffed entirely by Yale
					College undergraduates, YMUN brings together more than 2,000
					students and faculty from around the world to simulate the
					activities of the United Nations.
				</div>

				{/* Info Section */}
				<div className="mt-6 bg-[#222] p-4 rounded-lg flex flex-wrap justify-between gap-4">
					<div className="text-sm">
						<div className="font-bold text-yellow-400">
							Key Information
						</div>
						<div>Delegate Fee: $150</div>
						<div>Hotel Fee: $150</div>
					</div>

					<div className="text-sm">
						<div className="font-bold text-yellow-400">
							Registration Deadline
						</div>
						<div>September 15, 2025</div>
					</div>

					<div className="text-sm">
						<div className="font-bold text-yellow-400">
							Location
						</div>
						<div>Yale University Campus</div>
					</div>
				</div>
			</div>
		</div>
	);
}
