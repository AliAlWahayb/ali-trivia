"use client";
import { usePusherBind } from "@/hooks/usePusherBind";
import { usePusherSubscribe } from "@/hooks/usePusherSubscribe";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Player {
  roomId: string;
  username: string;
}

interface ScoreProps {
  roomId: string;
  username: string;
  lang: "ar" | "en";
  dict: Record<string, string>;
}

const Score = ({ roomId, username, dict, lang }: ScoreProps) => {
  const [score, setScore] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

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
          setError(dict.playerRemoved);
          // Wait for 7 seconds before redirecting
          setTimeout(() => {
            router.push(`/${lang}/`);
          }, 7000);
        }
      } catch (err) {
        console.error("Error handling players:", err);
        setError(dict.failedToGetStatus);
      }
    },
    [username, dict.playerRemoved, dict.failedToGetStatus, router, lang]
  );

  usePusherBind(channel, "leader-board", handleList);

  //handle game end
  const handelGameEnd = useCallback(
    async (data: string) => {
      try {
        console.log("game ended", data);

        document.cookie = "token=; Max-Age=0; path=/";

        localStorage.removeItem("roomId");
        sessionStorage.clear();

        setError(dict.gameEndedRedirect);

        // Wait for 7 seconds before redirecting
        setTimeout(() => {
          router.push(`/${lang}/`);
        }, 7000);
      } catch (err) {
        console.error("Error ending game:", err);
        setError(dict.failedToEndGame);
      }
    },
    [dict.gameEndedRedirect, dict.failedToEndGame, router, lang]
  );

  usePusherBind(channel, "end-game", handelGameEnd);

  // Fetch player score on mount
  useEffect(() => {
    const fetchPlayerScore = async () => {
      console.log("Fetching player score for:", username);
      try {
        const response = await fetch("/api/get-leader-board", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ roomId }),
        });
        const data = await response.json();
        if (data.success && Array.isArray(data.leaderboard)) {
          const playerData = data.leaderboard.find(
            (player: { player: string }) => player.player === username
          );
          if (playerData) {
            setScore(playerData.score);
          } else {
            setError(dict.playerRemoved);
            setTimeout(() => {
              router.push(`/${lang}/`);
            }, 7000);
          }
        } else {
          setScore(0);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setScore(0);
        setError(dict.failedToGetStatus);
      }
    };
    fetchPlayerScore();
  }, [roomId, username, dict, router, lang]);

  // Show error state
  if (pusherError) {
    return (
      <div className="flex flex-col min-h-screen w-full h-full bg-red-100 p-4 items-center justify-center">
        <div className="bg-red-500 text-white p-4 rounded-lg text-center max-w-md">
          <h3 className="font-bold mb-2">{dict["connection_error"]}</h3>
          <p className="mb-4">{pusherError.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-white text-red-500 px-4 py-2 rounded hover:bg-gray-100"
          >
            {dict.refreshPage}
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
          {dict.score} {score}
        </h4>
      )}
    </div>
  );
};

export default Score;
