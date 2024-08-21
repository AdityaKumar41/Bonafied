import { useTheme } from "next-themes";

import { MagicCard } from "@/components/magicui/magic-card";

export function InfoCard() {
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
          <span className="text-lg">view: 0</span>
        </div>
      </MagicCard>
      <MagicCard
        className="cursor-pointer flex-col items-center justify-center shadow-2xl whitespace-nowrap text-4xl"
        gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
      >
        <div className="flex flex-col items-center">
          <span className="text-lg">Credentials Viwed</span>
          <span className="text-lg">view: 0</span>
        </div>
      </MagicCard>
      <MagicCard
        className="cursor-pointer flex-col items-center justify-center shadow-2xl whitespace-nowrap text-4xl"
        gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
      >
        <div className="flex flex-col items-center">
          <span className="text-lg">Credentials Engaged</span>
          <span className="text-lg">view: 0</span>
        </div>
      </MagicCard>
      <MagicCard
        className="cursor-pointer flex-col items-center justify-center shadow-2xl whitespace-nowrap text-4xl"
        gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
      >
        <div className="flex flex-col items-center">
          <span className="text-lg">Credentials Verified</span>
          <span className="text-lg">view: 0</span>
        </div>
      </MagicCard>
    </div>
  );
}
