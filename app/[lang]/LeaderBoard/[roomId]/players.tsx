"use client";

import { usePusherBind } from "@/hooks/usePusherBind";
import { usePusherSubscribe } from "@/hooks/usePusherSubscribe";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AutoTextSize } from "auto-text-size";

interface Player {
  player: string;
  score: number;
}

interface PlayersProps {
  roomId: string;
  lang: "ar" | "en";
  dict: Record<string, string>;
}

const Players = ({ roomId, dict, lang }: PlayersProps) => {
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const channelName = `room-${roomId}`;
  const { channel, error: pusherError } = usePusherSubscribe(channelName);

  const [players, setPlayers] = useState<Player[]>([]);

  // Fetch the leaderboard data when the component mounts
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("/api/get-leader-board", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            roomId: roomId,
          }),
        });

        const data = await response.json();
        if (data.leaderboard.length > 0) {
          setPlayers(data.leaderboard);
        }

        if (!response.ok) {
          throw new Error(data.error || "Failed to get leaderboard");
        }

        console.log("got leaderboard successfully");
      } catch (error) {
        console.error("Error getting leaderboard:", error);
        setError(
          error instanceof Error ? error.message : "Failed to get leaderboard"
        );
      }
    };
    fetchLeaderboard();
  }, [roomId]);

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

  //handle game end
  const handelGameEnd = useCallback(
    async (data: string) => {
      try {
        console.log("game ended", data);

        document.cookie = "token=; Max-Age=0; path=/";

        localStorage.removeItem("roomId");
        sessionStorage.clear();

        // Wait for 1 minutes before redirecting
        setTimeout(() => {
          router.push(`/${lang}/`);
        }, 60000);
      } catch (err) {
        console.error("Error ending game:", err);
        setError("Failed to end game");
      }
    },
    [lang, router]
  );

  usePusherBind(channel, "end-game", handelGameEnd);

  // Sort by Score descending
  const sortedPlayers = players.sort((a, b) => b.score - a.score);

  // Show error state
  if (pusherError) {
    return (
      <div className="flex flex-col min-h-screen w-full h-full bg-red-100 p-4 items-center justify-center">
        <div className="bg-red-500 text-white p-4 rounded-lg text-center max-w-md">
          <h3 className="font-bold mb-2">{dict["connectionError"]}</h3>
          <p className="mb-4">{pusherError.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-white text-red-500 px-4 py-2 rounded hover:bg-gray-100"
          >
            {dict["refreshPage"]}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className=" w-full h-full">
      {error && (
        <div className="bg-red-500 text-white p-2 text-center">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 text-xs underline"
          >
            {dict["dismiss"]}
          </button>
        </div>
      )}
      {sortedPlayers.length > 0 ? (
        sortedPlayers.map((player, idx) => (
          <div
            key={player.player + idx}
            className="flex justify-between text-lg items-center mb-2 pb-1 border-b border-gray-300 w-full px-5"
          >
            <div className="w-2/3 text-center">
              <AutoTextSize
                mode="multiline"
                maxFontSizePx={16}
                className="w-full text-start truncate text-text-primary font-semibold"
              >
                {player.player}
              </AutoTextSize>
            </div>

            <p className="w-1/3 text-end pe-4 text-secondary font-semibold">
              {player.score}
            </p>
          </div>
        ))
      ) : (
        <p className="text-text-primary text-center">{dict["noPlayers"]}</p>
      )}
    </div>
  );
};

export default Players;
