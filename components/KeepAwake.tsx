"use client";
import { useEffect } from "react";

export default function KeepAwake() {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let wakeLock: any = null;

    async function requestWakeLock() {
      try {
        wakeLock = await navigator.wakeLock?.request("screen");
      } catch (err) {
        // Wake Lock not supported or failed
        console.error("Wake Lock error:", err);
      }
    }

    requestWakeLock();
    document.addEventListener("visibilitychange", requestWakeLock);

    return () => {
      document.removeEventListener("visibilitychange", requestWakeLock);
      if (wakeLock) {
        wakeLock.release();
      }
    };
  }, []);

  return null;
}
