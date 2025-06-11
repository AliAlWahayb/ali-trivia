"use client";

import { usePusherBind } from "@/hooks/usePusherBind";
import { usePusherSubscribe } from "@/hooks/usePusherSubscribe";
import { useCallback, useState } from "react";
import Countdown, { zeroPad } from "react-countdown";

interface Props {
  roomId: string;
}

export default function QuestionsCard({ roomId }: Props) {
  const [Round, setRound] = useState(1);
  const [Players, setPlayers] = useState(0);

  const [correctIsLoading, setCorrectIsLoading] = useState(false);
  const [wrongIsLoading, setWrongIsLoading] = useState(false);
  const [skiptIsLoading, setSkiptIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const channelName = `room-${roomId}`;
  const { channel, error: pusherError } = usePusherSubscribe(channelName);

  const handleCount = useCallback((data: string[]) => {
    try {
      console.log("leaderboard received:", data); // Debug log
      setPlayers(data.length);
    } catch (err) {
      console.error("Error handling player count:", err);
      setError("Failed to update player status");
    }
  }, []);

  usePusherBind(channel, "leader-board", handleCount);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [questions, setQuestions] = useState({
    id: 1,
    question: "What is the capital of France?",
    answer: "Paris",
  });

  // State for countdown
  const [targetDate, setTargetDate] = useState<number | null>(null);
  const [timerKey, setTimerKey] = useState(0);
  const [shouldRestart, setShouldRestart] = useState(false);

  // Handler to start/restart the countdown
  const startCountdown = () => {
    setTargetDate(Date.now() + 10000); // 10 seconds from now
    setTimerKey((k) => k + 1); // Change key to force remount
  };



  const [topQueue, setTopQueue] = useState<string>("");
  const handleQueue = useCallback((data: string[]) => {
    try {
      console.log("Queue update received:", data); // Debug log
      if (!data || data.length === 0) {
        setTopQueue("");
      } else {
        setTopQueue(data[0]);
        startCountdown();
      }
    } catch (err) {
      console.error("Error handling queue top:", err);
      setError("Failed to update queue status");
    }
  }, []);

  usePusherBind(channel, "buzzer-queue", handleQueue);

  const handelCorrectAnswer = async () => {
    if (correctIsLoading) return;

    setRound(Round + 1);
    setShouldRestart(false);

    try {
      setCorrectIsLoading(true);
      setError(null);

      const response = await fetch("/api/update-score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          player: topQueue,
          roomId: roomId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update score");
      }

      console.log("updated score successfully");
    } catch (error) {
      console.error("Error updating score:", error);
      setError(
        error instanceof Error ? error.message : "Failed to update score"
      );
    } finally {
      setCorrectIsLoading(false);
    }
  };


  const handleWrongAnswer = async () => {
    if (wrongIsLoading) return;

    setShouldRestart(true);

    try {
      setWrongIsLoading(true);
      setError(null);

      const response = await fetch("/api/pop-queue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomId: roomId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to pop queue");
      }

      console.log("popped queue successfully");
    } catch (error) {
      console.error("Error popping queue:", error);
      setError(
        error instanceof Error ? error.message : "Failed to pop queue"
      );
    } finally {
      setWrongIsLoading(false);
    }
  };

  const handleSkip = async () => {
    if (skiptIsLoading) return;

    
    setShouldRestart(false);

    try {
      setSkiptIsLoading(true);
      setError(null);

      const response = await fetch("/api/empty-queue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomId: roomId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to empty queue");
      }

      console.log("emptyed queue successfully");
    } catch (error) {
      console.error("Error emptying queue:", error);
      setError(
        error instanceof Error ? error.message : "Failed to empty queue"
      );
    } finally {
      setSkiptIsLoading(false);
    }
  };

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
    <div className="w-full max-w-md bg-gray-100 rounded-lg  p-6">
      <div className="flex justify-between text-center mb-4">
        <h1 className="text-lg font-bold mb-6 text-text-primary text-start">
          Round {Round}
        </h1>
        <h1 className="text-lg font-bold mb-6 text-text-primary text-start">
          {Players} Players
        </h1>
      </div>
      <div className="flex flex-col justify-between text-center mb-4">
        <h1 className="text-xl font-bold mb-6 text-text-primary text-start">
          {questions.question}
        </h1>
        <h1 className="text-xl font-bold mb-6 text-text-primary text-start">
          Answer: {questions.answer}
        </h1>
      </div>
      <div className="flex flex-col gap-4 justify-between mt-6">
        {targetDate ? (
          <Countdown
            key={timerKey}
            date={targetDate}
            autoStart={true}
            renderer={({ seconds, completed }) => (
              <h1 className="text-6xl font-bold mb-6 text-secondary text-center">
                {completed ? zeroPad(seconds) : zeroPad(seconds)}
              </h1>
            )}
            onComplete={() => {
              console.log("Countdown completed!");
              if (shouldRestart) {
                setTimeout(startCountdown, 500); // Small delay for UX
              }
            }}
          />
        ) : (
          <h1 className="text-6xl font-bold mb-6 text-secondary text-center">
            10
          </h1>
        )}
        <div className="flex flex-col gap-4">
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
          <button
            disabled={correctIsLoading}
            onClick={handelCorrectAnswer}
            className="w-full bg-success text-white font-semibold py-2 rounded-lg  hover:bg-primary hover:text-white transition duration-300 transform active:scale-95"
          >
            Correct Answer
          </button>
          <button
            disabled={wrongIsLoading}
            onClick={handleWrongAnswer}
            className="w-full bg-danger text-white font-semibold py-2 rounded-lg  hover:bg-primary hover:text-white transition duration-300 transform active:scale-95"
          >
            Wrong Answer
          </button>
          <button 
          disabled={skiptIsLoading}
          onClick={handleSkip}
          className="w-full bg-warning text-white font-semibold py-2 rounded-lg  hover:bg-primary hover:text-white transition duration-300 transform active:scale-95">
            Skip Question
          </button>
        </div>
      </div>
    </div>
  );
}
