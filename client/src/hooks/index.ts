"use client";
import { useEffect } from "react";
import { useUserStore } from "@/components/store/index";
import Cookies from "js-cookie";
import { redirect, usePathname } from "next/navigation";

const useAuth = () => {
  const { setUser, setLoading } = useUserStore();
  const pathname = usePathname();

  useEffect(() => {
    const token = Cookies.get("token");
    console.log(token);

    if (!token && !["/login", "/signup"].includes(pathname)) {
      redirect("/login");
    }

    setLoading(true);
    fetch("http://localhost:5000/auth/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Authentication failed");
        const userData = await res.json();
        if (token) {
          setUser(userData, token);
        }
      })
      .catch(() => {
        Cookies.remove("token");
      })
      .finally(() => {
        setLoading(false); // Ensure loading is set to false after the fetch completes
      });
  }, [setUser, setLoading]); // Added setLoading to the dependency array
};

export default useAuth;
