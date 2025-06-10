"use client"
import { usePusherBind } from "@/hooks/usePusherBind";
import { usePusherSubscribe } from "@/hooks/usePusherSubscribe";
import { useEffect, useState } from "react";

interface Player {
    roomId: string;
    username: string;
}

export default function Score({ roomId, username }: Player) {
    const [score, setScore] = useState<number>(0);
    const channelName = `room-${roomId}`;
    const { channel, error } = usePusherSubscribe(channelName);

    // Handle errors
    useEffect(() => {
        if (error) {
            console.error("Pusher connection error:", error);
        }
    }, [error]);

    usePusherBind(channel, "score-update", (data) => {
        if (data.player === username) {
            setScore(data.score);
        }
    });

    return (
        <div>
            {error ? (
                <p className="text-red-500">Score unavailable</p>
            ) : (
                <h4 className="text-lg font-semibold text-text-secondary">Score {score}</h4>
            )}
        </div>
    );
}