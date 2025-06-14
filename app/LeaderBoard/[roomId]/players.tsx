"use client";

import { usePusherBind } from "@/hooks/usePusherBind";
import { usePusherSubscribe } from "@/hooks/usePusherSubscribe";
import { useCallback, useState } from "react";

interface Player {
  player: string;
  score: number;
}

interface Props {
  roomId: string;
}

const Players = ({ roomId }: Props) => {
  const [error, setError] = useState<string | null>(null);
  const channelName = `room-${roomId}`;
  const { channel, error: pusherError } = usePusherSubscribe(channelName);

  const [players, setPlayers] = useState<Player[]>([]);

  const handleList = useCallback((data: Player[]) => {
    try {
      console.log("leaderboard received:", data); // Debug log
      setPlayers(data);
    } catch (err) {
      console.error("Error handling players:", err);
      setError("Failed to get player status");
    }
  }, []);

  usePusherBind(channel, "leader-board", handleList);

  // Sort by Score descending
  const sortedPlayers = players.sort((a, b) => b.score - a.score);

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
    <div className="">
      {error && (
        <div className="bg-red-500 text-white p-2 text-center">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 text-xs underline"
          >
            Dismiss
          </button>
        </div>
      )}
      {sortedPlayers.length > 0 ? (
        sortedPlayers.map((player, idx) => (
          <div
            key={player.player + idx}
            className="flex justify-between text-lg items-center mb-2 pb-1 border-b border-gray-300 w-full px-5"
          >
            <p className="text-text-primary font-semibold">{player.player}</p>
            <p className="text-secondary font-semibold">{player.score}</p>
          </div>
        ))
      ) : (
        <p className="text-text-primary text-center">
          No players in Leaderboard
        </p>
      )}
    </div>
  );
};

export default Players;
