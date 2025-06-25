"use client";
import ErrorAlert from "@/components/ErrorAlert";
import PusherError from "@/components/PusherError";
import { usePusherBind } from "@/hooks/usePusherBind";
import { usePusherSubscribe } from "@/hooks/usePusherSubscribe";
import { Dict } from "@/types/dict";
import { getCsrfToken } from "@/lib/getCsrfToken";
import { useCallback, useEffect, useState } from "react";

interface Props {
  roomId: string;
  lang: "ar" | "en";
  dict: Dict;
}

const Queue = ({ roomId, dict }: Props) => {
  const [error, setError] = useState<string | null>(null);

  const channelName = `room-${roomId}`;
  const { channel, error: pusherError } = usePusherSubscribe(channelName);

  const [queue, setQueue] = useState<string[]>([]);

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
          body: JSON.stringify({
            roomId: roomId,
          }),
        });

        const data = await response.json();
        if (data.queue.length > 0) {
          setQueue(data.queue);
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
  }, [dict.errors.FailedToGetQueue, roomId]);

  const handleQueue = useCallback(
    (data: string[]) => {
      try {
        if (!data || data.length === 0) {
          setQueue([]);
        } else {
          setQueue(data);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError(dict.errors.FailedToUpdateQueueStatus);
      }
    },
    [dict.errors.FailedToUpdateQueueStatus]
  );

  usePusherBind(channel, "buzzer-queue", handleQueue);

  // Show error state
  if (pusherError) {
    return <PusherError dict={dict} pusherError={pusherError.message} />;
  }

  return (
    <div className="w-full max-w-md bg-gray-100 rounded-lg px-6 py-3 ">
      <div className="flex flex-row justify-between ">
        <p className="text-text-primary font-semibold text-lg">
          {dict.buzzerQueue}
        </p>
      </div>

      <div className="mt-4">
        {error && (
          <ErrorAlert
            message={error}
            onDismiss={() => setError(null)}
            dict={dict}
          />
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
          <p className="text-text-primary text-center">
            {dict.errors.noPlayersInQueue}
          </p>
        )}
      </div>
    </div>
  );
};

export default Queue;
