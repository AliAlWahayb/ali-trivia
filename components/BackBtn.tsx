"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { customConfirm } from "./customConfirm";
import { Dict } from "@/types/dict";
import { getCsrfToken } from "@/lib/getCsrfToken";

interface BackBtnProps {
  role?: string;
  name?: string;
  roomId?: string;
  noConfirm?: boolean; // prop to skip confirmation
  dict: Dict;
  lang: "ar" | "en";
}

// Handles ending the game for admin
const handleEnd = async (roomId: string) => {
  try {
    const response = await fetch("/api/end-game", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-csrf-token": getCsrfToken() || "",
      },
      body: JSON.stringify({ roomId }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to end game");
    }
  } catch {}
};

// Handles leaving the game for player
const handleLeave = async (player: string, roomId: string) => {
  try {
    const response = await fetch("/api/leave-player", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-csrf-token": getCsrfToken() || "",
      },
      body: JSON.stringify({ player, roomId }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to leave player");
    }
  } catch {}
};

const BackBtn = ({
  role,
  name,
  roomId,
  noConfirm = false,
  dict,
  lang,
}: BackBtnProps) => {
  const router = useRouter();

  // Handles the back button click with confirmation and cleanup
  const handleBack = async () => {
    // If noConfirm prop is passed, skip confirmation
    if (
      !noConfirm &&
      !(await customConfirm(dict.backConfirmation, dict.yes, dict.no))
    )
      return;

    // Clean up based on role
    if (role === "admin") {
      if (localStorage.getItem("trivia-questions")) {
        localStorage.removeItem("trivia-questions");
      }
      if (roomId) handleEnd(roomId);
    } else if (role === "player") {
      if (name && roomId) handleLeave(name, roomId);
    }
    router.push(`/${lang}`);
  };

  return (
    <button
      onClick={handleBack}
      type="button"
      className="bg-background-light text-primary text-center font-semibold border-1 border-primary p-1 rounded-lg   transition duration-300 transform active:scale-95 flex items-center justify-center"
      aria-label="Go Back"
    >
      <ArrowLeftIcon className="w-5 h-5" />
    </button>
  );
};

export default BackBtn;
