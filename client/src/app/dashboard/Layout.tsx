// app/layout.tsx
"use client";
import React, { useEffect, useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconLogin,
  IconSettings,
  IconUserBolt,
  IconUserPlus,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import useAuth from "@/hooks";
import { useUserStore } from "@/components/store";
import LoginForm from "@/components/ui/Login";
import { useDataStore } from "@/components/store/data";

export default function Layout({ children }: { children: React.ReactNode }) {
  useAuth();
  const [open, setOpen] = useState(false);
  const { user, loading } = useUserStore();

  const { data, setData, isChanged } = useDataStore();

  useEffect(() => {
    fetch("http://localhost:5000/get")
      .then(async (res) => {
        const fetchedData = await res.json();
        setData(fetchedData);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  }, [isChanged, setData, user]);

  const links = [
    {
      label: "Dashboard",
      href: "/",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Credentials",
      href: "/credentaial",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  const newlink = [
    {
      label: "Login",
      href: "/login",
      icon: (
        <IconLogin className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Signup",
      href: "/signup",
      icon: (
        <IconUserPlus className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  return (
    <>
      <div
        className={cn(
          "flex flex-col md:flex-row dark bg-gray-100 dark:bg-neutral-800 w-full flex-1 mx-auto overflow-hidden",
          "h-screen"
        )}
      >
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className="justify-between gap-10">
            <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
              <Logo />
              {user ? (
                <div className="mt-8 flex flex-col gap-2">
                  {links.map((link, idx) => (
                    <SidebarLink key={idx} link={link} />
                  ))}
                </div>
              ) : (
                <div className="mt-8 flex flex-col gap-2">
                  {newlink.map((link, idx) => (
                    <SidebarLink key={idx} link={link} />
                  ))}
                </div>
              )}
            </div>
            {user ? (
              <div>
                <SidebarLink
                  link={{
                    label: `${user?.firstname} ${user?.lastname}`,
                    href: "/profile",
                    icon: (
                      <Image
                        src="/path-to-avatar.jpg"
                        className="h-7 w-7 flex-shrink-0 rounded-full"
                        width={50}
                        height={50}
                        alt="Avatar"
                      />
                    ),
                  }}
                />
              </div>
            ) : (
              ""
            )}
          </SidebarBody>
        </Sidebar>
        {user ? (
          <main className="flex-1 bg-neutral-800 overflow-y-auto border-l custom-class-scroll">
            {children}
          </main>
        ) : (
          <main className="flex-1 bg-neutral-800 overflow-y-auto border-l custom-class-scroll">
            {children}
          </main>
        )}
      </div>
    </>
  );
}

const Logo = () => {
  return (
    <Link
      href="/"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <span className="font-medium text-black dark:text-white whitespace-pre">
        Bonafied
      </span>
    </Link>
  );
};
