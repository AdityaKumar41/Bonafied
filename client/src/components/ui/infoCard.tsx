"usec client";
import { useTheme } from "next-themes";

import { MagicCard } from "@/components/magicui/magic-card";
import { useDataStore } from "../store/data";
import { useEffect, useState } from "react";
import { useUserStore } from "../store";

export function InfoCard() {
  // Access state and actions from the Zustand store
  const { data } = useDataStore();
  const { user } = useUserStore();

  interface DataGet {
    credViewCount: number;
    data: [];
    verifiedCount: number;
  }

  const [getView, setView] = useState<DataGet>();
  useEffect(() => {
    fetch("http://localhost:5000/credview")
      .then(async (res) => {
        const credView = await res.json();
        // set the data
        setView(credView);
      })
      .catch((err) => {
        console.log("Error to get data");
      });
  }, [user]);

  console.log(getView);

  const theme = "dark";
  return (
    <div
      className={
        "flex h-[500px] w-full flex-col gap-4 lg:h-[250px] lg:flex-row pb-4"
      }
    >
      <MagicCard
        className="cursor-pointer flex-col items-center justify-center shadow-2xl whitespace-nowrap text-4xl"
        gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
      >
        <div className="flex flex-col items-center">
          <span className="text-lg">Credentials Issued</span>
          <span className="text-lg">view: {data.length}</span>
        </div>
      </MagicCard>
      <MagicCard
        className="cursor-pointer flex-col items-center justify-center shadow-2xl whitespace-nowrap text-4xl"
        gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
      >
        <div className="flex flex-col items-center">
          <span className="text-lg">Credentials Viwed</span>
          <span className="text-lg">view: {getView?.credViewCount || "0"}</span>
        </div>
      </MagicCard>
      <MagicCard
        className="cursor-pointer flex-col items-center justify-center shadow-2xl whitespace-nowrap text-4xl"
        gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
      >
        <div className="flex flex-col items-center">
          <span className="text-lg">Credentials Engaged</span>
          <span className="text-lg">view: {getView?.credViewCount || "0"}</span>
        </div>
      </MagicCard>
      <MagicCard
        className="cursor-pointer flex-col items-center justify-center shadow-2xl whitespace-nowrap text-4xl"
        gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
      >
        <div className="flex flex-col items-center">
          <span className="text-lg">Credentials Verified</span>
          <span className="text-lg">view: {getView?.verifiedCount || "0"}</span>
        </div>
      </MagicCard>
    </div>
  );
}
