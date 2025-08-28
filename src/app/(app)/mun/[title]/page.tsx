import React from "react";
import { notFound } from "next/navigation";

// Individual MUN pages
import HarvardPage from "@/components/mun-pages/HarvardPage";
import ColumbiaPage from "@/components/mun-pages/ColumbiaPage";
import YaleMUNPage from "@/components/mun-pages/YalePage";
import YalePage from "@/components/mun-pages/YalePage";

const munPages: Record<string, React.ReactNode> = {
  "Harvard National MUN": <HarvardPage />,
  "Columbia Model UN": <ColumbiaPage />,
  "Yale Model UN": <YalePage />,
  // you can add YalePage etc. later
};

export default function MunPage({ params }: { params: { title: string } }) {
  const decodedTitle = decodeURIComponent(params.title);

  // Check if we have a page for this MUN
  if (!munPages[decodedTitle]) {
    notFound(); // shows Next.js 404 page
  }

  return <>{munPages[decodedTitle]}</>;
}
