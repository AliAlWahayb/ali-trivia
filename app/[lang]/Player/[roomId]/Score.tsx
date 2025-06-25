"use client";
import { usePusherBind } from "@/hooks/usePusherBind";
import { usePusherSubscribe } from "@/hooks/usePusherSubscribe";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PusherError from "@/components/PusherError";
import { Dict } from "@/types/dict";
import { getCsrfToken } from "@/lib/getCsrfToken";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Player {
  roomId: string;
  username: string;
}

interface ScoreProps {
  roomId: string;
  username: string;
  lang: "ar" | "en";
  dict: Dict;
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
        // Find the player object by username
        const playerData = data.find((player) => player.player === username);
        if (playerData) {
          setScore(playerData.score); // Update score based on player data
        } else {
          setError(dict.errors.playerRemoved);
          // Wait for 7 seconds before redirecting
          setTimeout(() => {
            router.push(`/${lang}/`);
          }, 7000);
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError(dict.errors.failedToGetStatus);
      }
    },
    [
      username,
      dict.errors.playerRemoved,
      dict.errors.failedToGetStatus,
      router,
      lang,
    ]
  );

  usePusherBind(channel, "leader-board", handleList);

  // Listen for queue updates and check if player is still in queue/leaderboard
  const handleQueueUpdate = useCallback(
    (queue: string[]) => {
      if (!queue.includes(username)) {
        fetch("/api/get-leader-board", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-csrf-token": getCsrfToken() || "",
          },
          body: JSON.stringify({ roomId }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (!data.success || !Array.isArray(data.leaderboard)) return;
            const playerData = data.leaderboard.find(
              (p: { player: string }) => p.player === username
            );
            if (!playerData) {
              setError(null);
              router.push(`/${lang}/`);
            }
          });
      }
    },
    [username, roomId, lang, router]
  );
  usePusherBind(channel, "buzzer-queue", handleQueueUpdate);

  //handle game end
  const handelGameEnd = useCallback(
    async () => {
      try {

        document.cookie = "token=; Max-Age=0; path=/";

        localStorage.removeItem("roomId");
        sessionStorage.clear();

        setError(dict.errors.gameEndedRedirect);

        // Wait for 7 seconds before redirecting
        setTimeout(() => {
          router.push(`/${lang}/`);
        }, 7000);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError(dict.errors.failedToEndGame);
      }
    },
    [dict.errors.gameEndedRedirect, dict.errors.failedToEndGame, router, lang]
  );

  usePusherBind(channel, "end-game", handelGameEnd);

  // Fetch player score on mount
  useEffect(() => {
    const fetchPlayerScore = async () => {
      try {
        const response = await fetch("/api/get-leader-board", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-csrf-token": getCsrfToken() || "",
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
            setError(dict.errors.playerRemoved);
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
        setError(dict.errors.failedToGetStatus);
      }
    };
    fetchPlayerScore();
  }, [roomId, username, dict, router, lang]);

  // Show error state
  if (pusherError) {
    return <PusherError dict={dict} pusherError={pusherError.message} />;
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
