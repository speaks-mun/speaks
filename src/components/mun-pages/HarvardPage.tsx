// app/(routes)/events/harvard/page.tsx

import React from "react";
import Image from "next/image";

export default function HarvardPage() {
	return (
		<div className="bg-[#111] text-white min-h-screen">
			{/* Header */}
			<header className="flex items-center bg-black p-4">
				<Image
					src="/speaks-logo.jpg" // place this image inside public/
					alt="Speaks Logo"
					width={120}
					height={40}
				/>
			</header>

			{/* Hero Banner */}
			<div
				className="h-[300px] w-full bg-center bg-cover"
				style={{
					backgroundImage: "url('/harvard.jpg')",
				}}
			></div>

			{/* Event Container */}
			<div className="p-6">
				<h1 className="text-2xl font-bold mb-2">
					Harvard National Model United Nations
				</h1>
				<p>Boston, Massachusetts</p>
				<p>February 10, 2025 – February 13, 2025</p>

				{/* Tabs */}
				<div className="flex justify-around border-b border-gray-700 my-6">
					{["Overview", "Committee", "Policy", "Organizer"].map(
						(tab) => (
							<div
								key={tab}
								className="p-3 cursor-pointer hover:bg-[#222]"
							>
								{tab}
							</div>
						)
					)}
				</div>

				{/* Overview Content */}
				<div className="bg-[#1a1a1a] p-4 rounded-lg leading-relaxed">
					Harvard National Model United Nations (HNMUN) is the
					largest, oldest, and most prestigious conference of its
					kind. Staffed entirely by Harvard College undergraduates,
					HNMUN brings over 2,000 students and faculty together from
					colleges and universities around the world to simulate the
					activities of the United Nations.
				</div>

				{/* Info Section */}
				<div className="mt-6 bg-[#222] p-4 rounded-lg flex flex-wrap justify-between">
					<div className="m-2 text-sm">
						<div className="font-bold text-[#f5c518]">
							Key Information
						</div>
						<div>Delegate Fee: $90</div>
						<div>Hotel Fee: $300</div>
					</div>
					<div className="m-2 text-sm">
						<div className="font-bold text-[#f5c518]">
							Registration Deadline
						</div>
						<div>January 15, 2025</div>
					</div>
					<div className="m-2 text-sm">
						<div className="font-bold text-[#f5c518]">Location</div>
						<div>Harvard University Campus</div>
					</div>
				</div>
			</div>
		</div>
	);
}
