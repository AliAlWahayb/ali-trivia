"use client";

import ErrorAlert from "@/components/ErrorAlert";
import PusherError from "@/components/PusherError";
import { usePusherBind } from "@/hooks/usePusherBind";
import { usePusherSubscribe } from "@/hooks/usePusherSubscribe";
import { Dict } from "@/types/dict";
import { useState, useCallback, useEffect } from "react";
import { getCsrfToken } from "@/lib/getCsrfToken";

interface BuzzerProps {
  roomId: string;
  username: string;
  lang: "ar" | "en";
  dict: Dict;
}

const Buzzer = ({ roomId, username, dict, lang }: BuzzerProps) => {
  const [buzzedIn, setBuzzedIn] = useState(false);
  const [yourTurn, setYourTurn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper for updating the buzz state based on the queue
  const updateBuzzState = useCallback(
    (queue: string[] | undefined) => {
      if (!queue || queue.length === 0) {
        setBuzzedIn(false);
        setYourTurn(false);
        return;
      }
      if (!queue.includes(username)) {
        setBuzzedIn(false);
        setYourTurn(false);
        return;
      }
      setBuzzedIn(true);
      setYourTurn(queue[0] === username);
    },
    [username]
  );

  // Fetch the queue data when the component mounts
  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const response = await fetch("/api/get-queue", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-csrf-token": getCsrfToken() || "",
          },
          body: JSON.stringify({ roomId }),
        });

        const data = await response.json();
        if (data.success && Array.isArray(data.queue)) {
          updateBuzzState(data.queue);
        }

        if (!response.ok) {
          throw new Error(data.error || "Failed to get queue");
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setError(dict.errors.FailedToGetQueue);
      }
    };
    fetchQueue();
  }, [roomId, username, updateBuzzState, dict.errors.FailedToGetQueue]);

  const channelName = `room-${roomId}`;
  const { channel, error: pusherError } = usePusherSubscribe(channelName);

  const handleQueueUpdate = useCallback(
    (data: string[]) => {
      try {
        updateBuzzState(data);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError(dict.errors.FailedToUpdateQueueStatus);
      }
    },
    [dict.errors.FailedToUpdateQueueStatus, updateBuzzState]
  );

  usePusherBind(channel, "buzzer-queue", handleQueueUpdate);

  // Listen for leaderboard updates and redirect if player is not in leaderboard
  const handleLeaderBoardUpdate = useCallback(
    (data: { player: string; score: number }[]) => {
      const playerData = data.find((p) => p.player === username);
      if (!playerData) {
        setError(null);
        window.location.href = `/${lang}/`;
      }
    },
    [username, lang]
  );
  usePusherBind(channel, "leader-board", handleLeaderBoardUpdate);

  const handleBuzzIn = async () => {
    if (isLoading || buzzedIn) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/trigger-buzzer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": getCsrfToken() || "",
        },
        body: JSON.stringify({ roomId, player: username }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to buzz in");
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setError(dict.errors.FailedToBuzzIn);
    } finally {
      setIsLoading(false);
    }
  };

  // Show error state
  if (pusherError) {
    return <PusherError dict={dict} pusherError={pusherError.message} />;
  }

  return (
    <div className="flex flex-col min-h-screen w-full h-full rounded-lg  p-0">
      {error && (
        <ErrorAlert
          message={error}
          onDismiss={() => setError(null)}
          dict={dict}
        />
      )}
      <button
        disabled={buzzedIn || isLoading || !channel}
        onClick={handleBuzzIn}
        className={`flex-1 w-full h-full text-white text-5xl text-center font-semibold rounded-lg transition duration-300 transform active:scale-95 ${
          buzzedIn ? (yourTurn ? "bg-success" : "bg-warning") : "bg-secondary"
        }  flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed`}
        style={{ minHeight: "100%" }}
      >
        {!channel
          ? dict.connecting
          : isLoading
          ? dict.buzzing
          : buzzedIn
          ? yourTurn
            ? dict.yourTurn
            : dict.waiting
          : dict.buzzIn}
      </button>
    </div>
  );
};

export default Buzzer;
