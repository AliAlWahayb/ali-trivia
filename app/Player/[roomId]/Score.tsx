"use client";
import { usePusherBind } from "@/hooks/usePusherBind";
import { usePusherSubscribe } from "@/hooks/usePusherSubscribe";
import { useCallback, useState } from "react";

interface Player {
  roomId: string;
  username: string;
}

export default function Score({ roomId, username }: Player) {
  const [score, setScore] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const channelName = `room-${roomId}`;
  const { channel, error: pusherError } = usePusherSubscribe(channelName);

  const handleList = useCallback(
    (data: { player: string; score: number }[]) => {
      try {
        console.log("leaderboard received:", data); // Debug log
        // Find the player object by username
        const playerData = data.find((player) => player.player === username);
        if (playerData) {
          setScore(playerData.score); // Update score based on player data
        } else {
          setError("Player not found in leaderboard");
        }
      } catch (err) {
        console.error("Error handling players:", err);
        setError("Failed to get player status");
      }
    },
    [username]
  );

  usePusherBind(channel, "leader-board", handleList);

  // Show error state
  if (pusherError) {
    return (
      <div className="flex flex-col min-h-screen w-full h-full bg-red-100 p-4 items-center justify-center">
        <div className="bg-red-500 text-white p-4 rounded-lg text-center max-w-md">
          <h3 className="font-bold mb-2">Connection Error</h3>
          <p className="mb-4">{pusherError.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-white text-red-500 px-4 py-2 rounded hover:bg-gray-100"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <h4 className="text-lg font-semibold text-text-secondary">
          Score {score}
        </h4>
      )}
    </div>
  );
}
