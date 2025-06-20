"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { customConfirm } from "./customConfirm";

interface BackBtnProps {
  role?: string;
  name?: string;
  roomId?: string;
  noConfirm?: boolean; // Optional prop to skip confirmation
}

// Handles ending the game for admin
const handleEnd = async (roomId: string) => {
  try {
    const response = await fetch("/api/end-game", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to end game");
    }
    console.log("Ended game successfully");
  } catch (error) {
    console.error("Error ending game:", error);
  }
};

// Handles leaving the game for player
const handleLeave = async (player: string, roomId: string) => {
  try {
    const response = await fetch("/api/leave-player", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ player, roomId }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to leave player");
    }
    console.log("Left player successfully");
  } catch (error) {
    console.error("Error leaving player:", error);
  }
};

const BackBtn = ({ role, name, roomId, noConfirm=false }: BackBtnProps) => {
  const router = useRouter();

  // Handles the back button click with confirmation and cleanup
  const handleBack = async () => {
    // If noConfirm prop is passed, skip confirmation
    if (!noConfirm && !(await customConfirm("Are you sure you want to go back?", "Yes", "No"))) return;

    // Clean up based on role
    if (role === "admin") {
      if (localStorage.getItem("trivia-questions")) {
        localStorage.removeItem("trivia-questions");
      }
      if (roomId) handleEnd(roomId);
    } else if (role === "player") {
      if (name && roomId) handleLeave(name, roomId);
    }
    router.push("/");
  };

  return (
    <button
      onClick={handleBack}
      type="button"
      className="bg-backgroundLight text-primary text-center font-semibold border-2 border-primary p-1 rounded-lg hover:bg-primary hover:text-white transition duration-300 transform active:scale-95 flex items-center justify-center"
      aria-label="Go Back"
    >
      <ArrowLeftIcon className="w-5 h-5" />
    </button>
  );
};

export default BackBtn;
