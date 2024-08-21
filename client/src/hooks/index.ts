"use client";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useUserStore } from "@/components/store/index";
import Cookies from "js-cookie";

const useAuth = () => {
  const setUser = useUserStore((state) => state.setUser);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      router.push("/login");
      return;
    }

    fetch("http://localhost:5000/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Authentication failed");
        const userData = await res.json();
        setUser(userData, token); // Assuming the userData includes id, name, email
      })
      .catch(() => {
        Cookies.remove("token");
        router.push("/login");
      });
  }, [router, setUser]);
};

export default useAuth;
