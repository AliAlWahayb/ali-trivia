// Buzzer.tsx
"use client";

import { usePusherBind } from "@/hooks/usePusherBind";
import { usePusherSubscribe } from "@/hooks/usePusherSubscribe";
import { useState, useCallback, useEffect } from "react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Player {
  roomId: string;
  username: string;
}

interface BuzzerProps {
  roomId: string;
  username: string;
  lang: "ar" | "en";
  dict: Record<string, string>;
}

const Buzzer = ({ roomId, username, dict }: BuzzerProps) => {
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
          },
          body: JSON.stringify({
            roomId: roomId,
          }),
        });

        const data = await response.json();
        console.log("Queue data:", data); // Debug log
        if (data.success && Array.isArray(data.queue)) {
          updateBuzzState(data.queue);
        }

        if (!response.ok) {
          throw new Error(data.error || "Failed to get queue");
        }

        console.log("got queue successfully");
        console.log(data);
      } catch (error) {
        console.error("Error getting queue:", error);
        setError(
          error instanceof Error ? error.message : "Failed to get queue"
        );
      }
    };
    fetchQueue();
  }, [roomId, username, updateBuzzState]);

  const channelName = `room-${roomId}`;
  const { channel, error: pusherError } = usePusherSubscribe(channelName);

  const handleQueueUpdate = useCallback(
    (data: string[]) => {
      try {
        console.log("Queue update received:", data); // Debug log
        updateBuzzState(data);
      } catch (err) {
        console.error("Error handling queue update:", err);
        setError("Failed to update queue status");
      }
    },
    [updateBuzzState]
  );

  usePusherBind(channel, "buzzer-queue", handleQueueUpdate);

  const handleBuzzIn = async () => {
    if (isLoading || buzzedIn) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/trigger-buzzer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          player: username,
          roomId: roomId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to buzz in");
      }

      console.log("Buzzed in successfully");
      // setBuzzedIn(true); //makes the waiting state buggy, so we handle it in the queue update
      // setYourTurn(data.queue[0] === username);
      // console.log(data);
    } catch (error) {
      console.error("Error buzzing in:", error);
      setError(error instanceof Error ? error.message : "Failed to buzz in");
    } finally {
      setIsLoading(false);
    }
  };

  // Show error state
  if (pusherError) {
    return (
      <div className="flex flex-col min-h-screen w-full h-full bg-red-100 p-4 items-center justify-center">
        <div className="bg-red-500 text-white p-4 rounded-lg text-center max-w-md">
          <h3 className="font-bold mb-2">{dict["connectionErrorTitle"]}</h3>
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
    <div className="flex flex-col min-h-screen w-full h-full bg-red-100 p-0">
      {error && (
        <div className="bg-red-500 text-white p-2 text-center">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 text-xs underline"
          >
            {dict.dismiss}
          </button>
        </div>
      )}
      <button
        disabled={buzzedIn || isLoading || !channel}
        onClick={handleBuzzIn}
        className={`flex-1 w-full h-full text-white text-5xl text-center font-semibold rounded-lg transition duration-300 transform active:scale-95 ${
          buzzedIn
            ? yourTurn
              ? "bg-green-500"
              : "bg-yellow-500"
            : "bg-blue-500"
        } hover:bg-blue-600 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed`}
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
