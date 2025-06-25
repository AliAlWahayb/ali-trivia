"use client";
import { useEffect } from "react";
import { generateCsrfToken } from "@/lib/csrf";

export default function SetCsrfCookie() {
  useEffect(() => {
    // Only set if not already present
    if (!document.cookie.includes("csrfToken=")) {
      const token = generateCsrfToken();
      document.cookie = `csrfToken=${token}; path=/; SameSite=Lax; max-age=3600`;
    }
  }, []);
  return null;
}
