// import { createClient } from "@/lib/supabase/server";

// export default async function DiscoverPage() {
// 	const supabase = createClient();

// 	const { data: profiles } = await supabase.from("profiles").select(`
//       id,
//       username,
//       avatar_url,
//       updated_at
//     `);

// 	return (
// 		<div className="container mx-auto py-10">
// 			<h1 className="text-3xl font-bold mb-5">Discover</h1>
// 			{profiles && profiles.length > 0 ? (
// 				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
// 					{profiles.map((profile) => (
// 						<div
// 							key={profile.id}
// 							className="bg-white rounded-lg shadow-md p-4"
// 						>
// 							<img
// 								src={
// 									profile.avatar_url ||
// 									"https://placehold.co/400x400"
// 								}
// 								alt={profile.username}
// 								className="w-full h-48 object-cover rounded-md mb-2"
// 							/>
// 							<h2 className="text-xl font-semibold">
// 								{profile.username}
// 							</h2>
// 							<p className="text-gray-600">
// 								Updated: {profile.updated_at}
// 							</p>
// 						</div>
// 					))}
// 				</div>
// 			) : (
// 				<p>No profiles found.</p>
// 			)}
// 		</div>
// 	);
// }

// import React from "react";
// // import speaksLogo from "./speaks-logo.jpg"; // <- put your uploaded logo in src folder as speaks-logo.png
// import Link from "next/link";
// const munList = [
// 	{
// 		title: "Harvard National MUN",
// 		date: "Thu, 12 Oct 2025",
// 		price: "$200",
// 		img: "https://i.ibb.co/tcDpr2P/mun1.jpg",
// 	},
// 	{
// 		title: "Yale Model UN",
// 		date: "Fri, 20 Oct 2025",
// 		price: "$150",
// 		img: "https://i.ibb.co/Zh1WjQC/mun2.jpg",
// 	},
// 	{
// 		title: "Columbia Model UN",
// 		date: "Mon, 2 Oct 2025",
// 		price: "$220",
// 		img: "https://i.ibb.co/yqPXcQB/mun4.jpg",
// 	},
// ];

// function Card({ data }) {
// 	return (
// 		<div className="bg-gray-900 rounded-xl shadow-lg overflow-hidden w-64 text-white">
// 			<img
// 				src={data.img}
// 				alt={data.title}
// 				className="h-36 w-full object-cover"
// 			/>
// 			<div className="p-3">
// 				<h3 className="text-lg font-semibold">{data.title}</h3>
// 				<p className="text-sm text-gray-400">{data.date}</p>
// 				<div className="flex justify-between items-center mt-2">
// 					<span className="text-sm font-bold">{data.price}</span>
// 					<Link href={`/mun/${encodeURIComponent(data.title)}`}>
// 						<button className="text-xs bg-gray-700 px-2 py-1 rounded">
// 							View Details
// 						</button>
// 					</Link>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }

// export default function App() {
// 	return (
// 		<div className="bg-black min-h-screen text-white px-10 py-6">
// 			{/* Top Navbar with Logo */}
// 			<div className="flex items-center mb-6">
// 				<img
// 					src="/speaks-logo.jpg"
// 					alt="Speaks Logo"
// 					className="h-8 w-8 mr-2"
// 				/>
// 				<h1 className="text-lg font-bold">Speaks</h1>
// 			</div>
// 			{/* Header */}
// 			<h1 className="text-2xl font-bold mb-6">Welcome ! 👋</h1>
// 			<p className="text-gray-400 mb-6">
// 				Discover your next MUN conference
// 			</p>
// 			{/* Featured MUNs only */}
// 			<h2 className="text-xl font-semibold mb-4">⭐ Featured MUNs</h2>
// 			<div className="flex gap-6">
// 				{munList.map((mun, idx) => (
// 					<Card key={idx} data={mun} />
// 				))}
// 			</div>
// 			{/* Footer Buttons */}
// 			<div className="flex justify-between mt-12 border-t border-gray-800 pt-4">
// 				<button className="text-gray-400 hover:text-white">
// 					🔍 Explore MUNs
// 				</button>
// 				<button className="bg-white text-black px-4 py-2 rounded-lg font-semibold">
// 					+ List Your MUN
// 				</button>
// 			</div>
//
// 		</div>
// 	);
// }

import React from "react";
import speaksLogo from "./speaks-logo.png"; // <- make sure this is in src folder

// Use your uploaded images for Harvard, Yale, Columbia
import harvardImg from "./harvard.jpg";
import yaleImg from "./yale.jpg";
import columbiaImg from "./columbia.jpg";

const munList = [
	{
		title: "Harvard National MUN",
		date: "Thu, 12 Oct 2025",
		price: "$200",
		img: "/harvard.jpg",
	},
	{
		title: "Yale Model UN",
		date: "Fri, 20 Oct 2025",
		price: "$150",
		img: "/yale.jpg",
	},
	{
		title: "Columbia Model UN",
		date: "Mon, 2 Oct 2025",
		price: "$220",
		img: "/columbia.jpg",
	},
];

function Card({ data }) {
	return (
		<div className="bg-gray-900 rounded-xl shadow-lg overflow-hidden w-64 text-white">
			<img
				src={data.img}
				alt={data.title}
				className="h-36 w-full object-cover"
			/>
			<div className="p-3">
				<h3 className="text-lg font-semibold">{data.title}</h3>
				<p className="text-sm text-gray-400">{data.date}</p>
				<div className="flex justify-between items-center mt-2">
					<span className="text-sm font-bold">{data.price}</span>
					<button className="text-xs bg-gray-700 px-2 py-1 rounded">
						View Details
					</button>
				</div>
			</div>
		</div>
	);
}

export default function App() {
	return (
		<div className="bg-black min-h-screen text-white px-10 py-6">
			{/* Top Navbar with Logo */}
			<div className="flex items-center mb-6">
				<img
					src="/speaks-logo.jpg"
					alt="Speaks Logo"
					className="h-10 w-10 mr-2"
				/>
				<h1 className="text-lg font-bold">Speaks</h1>
			</div>
			{/* Header */}
			<h1 className="text-2xl font-bold mb-6">Welcome ! 👋</h1>
			<p className="text-gray-400 mb-6">
				Discover your next MUN conference
			</p>
			{/* Featured MUNs only */}
			<h2 className="text-xl font-semibold mb-4">⭐ Featured MUNs</h2>
			<div className="flex gap-6">
				{munList.map((mun, idx) => (
					<Card key={idx} data={mun} />
				))}
			</div>
			{/* Footer Buttons */}
			<div className="flex justify-between mt-12 border-t border-gray-800 pt-4">
				<button className="text-gray-400 hover:text-white">
					🔍 Explore MUNs
				</button>
				<button className="bg-white text-black px-4 py-2 rounded-lg font-semibold">
					+ List Your MUN
				</button>
			</div>
			   
		</div>
	);
}
