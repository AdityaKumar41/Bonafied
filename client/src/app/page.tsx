// app/page.tsx (for Dashboard)
"use client";
import React, { useEffect } from "react";
import { InfoCard } from "@/components/ui/infoCard";
import { ChatGraph } from "@/components/ui/graph";
import { SideCard } from "@/components/ui/sideCard";

export default function DashboardPage() {
  return (
    <div className="p-4 dark rounded-tl-2xl border border-neutral-200 dark:border-neutral-700">
      <InfoCard />
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:w-3/4 h-full">
          <ChatGraph />
        </div>
        <div className="w-full lg:w-1/4">
          <SideCard />
        </div>
      </div>
    </div>
  );
}
