"use client";
import { usePusherBind } from "@/hooks/usePusherBind";
import { usePusherSubscribe } from "@/hooks/usePusherSubscribe";
import { useCallback, useState } from "react";

interface Props {
  roomId: string;
}

const Queue = ({ roomId }: Props) => {
  const [error, setError] = useState<string | null>(null);

  const channelName = `room-${roomId}`;
  const { channel, error: pusherError } = usePusherSubscribe(channelName);

  const [queue, setQueue] = useState<string[]>([]);
  const handleQueue = useCallback((data: string[]) => {
    try {
      console.log("Queue update received:", data); // Debug log
      if (!data || data.length === 0) {
        setQueue([]);
      } else {
        setQueue(data);
      }
    } catch (err) {
      console.error("Error handling queue update:", err);
      setError("Failed to update queue status");
    }
  }, []);

  usePusherBind(channel, "buzzer-queue", handleQueue);

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
    <div className="w-full max-w-md bg-gray-100 rounded-lg px-6 py-3 ">
      <div className="flex flex-row justify-between ">
        <p className="text-text-primary font-semibold text-lg">Buzzer Queue</p>
      </div>

      <div className="mt-4">
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
        {queue.length > 0 ? (
          queue.map((name, idx) => (
            <div
              key={name + idx}
              className="flex justify-between items-center mb-2 border-b border-gray-300 pb-1"
            >
              <p className="text-text-primary ">{name}</p>
            </div>
          ))
        ) : (
          <p className="text-text-primary text-center">No players in queue</p>
        )}
      </div>
    </div>
  );
};

export default Queue;
