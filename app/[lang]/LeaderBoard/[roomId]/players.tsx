"use client";

import { usePusherBind } from "@/hooks/usePusherBind";
import { usePusherSubscribe } from "@/hooks/usePusherSubscribe";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AutoTextSize } from "auto-text-size";
import PusherError from "@/components/PusherError";
import { Dict } from "@/types/dict";
import ErrorAlert from "@/components/ErrorAlert";
import { getCsrfToken } from "@/lib/getCsrfToken";

interface Player {
  player: string;
  score: number;
}

interface PlayersProps {
  roomId: string;
  lang: "ar" | "en";
  dict: Dict;
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
            "x-csrf-token": getCsrfToken() || "",
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

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setError(dict.errors.FailedToGetLeaderboard);
      }
    };
    fetchLeaderboard();
  }, [dict.errors.FailedToGetLeaderboard, roomId]);

  const handleList = useCallback(
    (data: Player[]) => {
      try {
        setPlayers(data);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError(dict.errors.failedToGetStatus);
      }
    },
    [dict.errors.failedToGetStatus]
  );

  usePusherBind(channel, "leader-board", handleList);

  //handle game end
  const handelGameEnd = useCallback(async () => {
    try {
      document.cookie = "token=; Max-Age=0; path=/";

      localStorage.removeItem("roomId");
      sessionStorage.clear();

      // Wait for 1 minutes before redirecting
      setTimeout(() => {
        router.push(`/${lang}/`);
      }, 60000);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError(dict.errors.failedToEndGame);
    }
  }, [dict.errors.failedToEndGame, lang, router]);

  usePusherBind(channel, "end-game", handelGameEnd);

  // Sort by Score descending
  const sortedPlayers = players.sort((a, b) => b.score - a.score);

  // Show error state
  if (pusherError) {
    return <PusherError dict={dict} pusherError={pusherError.message} />;
  }

  return (
    <div className=" w-full h-full">
      {error && (
        <ErrorAlert
          message={error}
          onDismiss={() => setError(null)}
          dict={dict}
        />
      )}
      {sortedPlayers.length > 0 ? (
        sortedPlayers.map((player, idx) => (
          <div
            key={player.player + idx}
            className="flex justify-between text-lg items-center mb-2 pb-1 border-b border-muted w-full px-5"
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
        <p className="text-text-primary text-center">
          {dict.errors.noPlayersInLeaderboard}
        </p>
      )}
    </div>
  );
};

export default Players;
