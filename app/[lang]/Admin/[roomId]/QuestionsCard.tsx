"use client";

import ErrorAlert from "@/components/ErrorAlert";
import PusherError from "@/components/PusherError";
import { usePusherBind } from "@/hooks/usePusherBind";
import { usePusherSubscribe } from "@/hooks/usePusherSubscribe";
import { Dict } from "@/types/dict";
import { useCallback, useEffect, useState } from "react";
import Countdown, { zeroPad } from "react-countdown";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Props {
  roomId: string;
  lang: "ar" | "en";
  dict: Record<string, string>;
}

interface TriviaQuestion {
  id: string;
  question: string;
  answer: string;
  [key: string]: string; // For any extra columns
}

interface QuestionsCardProps {
  roomId: string;
  lang: "ar" | "en";
  dict: Dict;
}

export default function QuestionsCard({ roomId, dict }: QuestionsCardProps) {
  const [Round, setRound] = useState(1);
  const [Players, setPlayers] = useState(0);

  const [correctIsLoading, setCorrectIsLoading] = useState(false);
  const [wrongIsLoading, setWrongIsLoading] = useState(false);
  const [skiptIsLoading, setSkiptIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const channelName = `room-${roomId}`;
  const { channel, error: pusherError } = usePusherSubscribe(channelName);

  const handleCount = useCallback(
    (data: string[]) => {
      try {
        console.log("leaderboard received:", data); // Debug log
        if (Array.isArray(data)) {
          setPlayers(data.length);
        } else {
          setPlayers(0);
        }
      } catch (err) {
        console.error("Error handling player count:", err);
        setError(dict.errors.FailedToUpdatePlayerStatus);
      }
    },
    [dict.errors.FailedToUpdatePlayerStatus]
  );

  usePusherBind(channel, "leader-board", handleCount);

  const [questions, setQuestions] = useState<TriviaQuestion | null>(null);
  const [remainingQuestions, setRemainingQuestions] = useState<
    TriviaQuestion[]
  >([]);

  function parseCSV(csv: string): TriviaQuestion[] {
    const [headerLine, ...lines] = csv.trim().split(/\r?\n/);
    const headers = headerLine.split(",").map((h) => h.trim());
    const questionIdx = headers.findIndex(
      (h) => h.toLowerCase() === "question"
    );
    const answerIdx = headers.findIndex((h) => h.toLowerCase() === "answer");
    const filteredLines = lines.filter((line) => line.trim().length > 0);
    const parsed = filteredLines.map((line, idx) => {
      const values = line.split(",");
      return {
        id: (idx + 1).toString(),
        question: values[questionIdx >= 0 ? questionIdx : 0]?.trim() || "",
        answer: values[answerIdx >= 0 ? answerIdx : 1]?.trim() || "",
      };
    });
    return parsed;
  }

  useEffect(() => {
    let shouldFetch = false;
    let parsed: TriviaQuestion[] = [];
    let current: TriviaQuestion | null = null;
    const local = localStorage.getItem("trivia-questions");
    if (local) {
      try {
        const parsedLocal = JSON.parse(local);
        if (
          typeof parsedLocal === "object" &&
          parsedLocal !== null &&
          Array.isArray(parsedLocal.remaining)
        ) {
          parsed = parsedLocal.remaining;
          current = parsedLocal.current || null;
          if (parsed.length === 0 && !current) {
            localStorage.removeItem("trivia-questions");
            shouldFetch = true;
          }
        } else {
          localStorage.removeItem("trivia-questions");
          shouldFetch = true;
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        localStorage.removeItem("trivia-questions");
        shouldFetch = true;
      }
    } else {
      shouldFetch = true;
    }
    if (shouldFetch) {
      fetch("/cleaned_trivia.csv")
        .then((res) => res.text())
        .then((csv) => {
          const parsedCSV = parseCSV(csv);
          if (parsedCSV.length === 0) {
            setError(dict.errors.noMoreQuestions);
            return;
          }
          // Pick a random question for the first one
          const randomIdx = Math.floor(Math.random() * parsedCSV.length);
          const firstQuestion = parsedCSV[randomIdx];
          const next = [
            ...parsedCSV.slice(0, randomIdx),
            ...parsedCSV.slice(randomIdx + 1),
          ];
          setRemainingQuestions(next);
          setQuestions(firstQuestion);
          localStorage.setItem(
            "trivia-questions",
            JSON.stringify({ current: firstQuestion, remaining: next })
          );
        })
        .catch(() => {
          setError(dict.errors.FailedToLoadQuestions);
        });
    } else {
      setRemainingQuestions(parsed);
      setQuestions(current || parsed[0] || null);
    }
  }, [dict.errors.FailedToLoadQuestions, dict.errors.noMoreQuestions]);

  const popQuestion = () => {
    if (remainingQuestions.length > 1) {
      const randomIdx = Math.floor(Math.random() * remainingQuestions.length);
      const nextQuestion = remainingQuestions[randomIdx];
      const next = [
        ...remainingQuestions.slice(0, randomIdx),
        ...remainingQuestions.slice(randomIdx + 1),
      ];
      setRemainingQuestions(next);
      setQuestions(nextQuestion);
      localStorage.setItem(
        "trivia-questions",
        JSON.stringify({ current: nextQuestion, remaining: next })
      );
    } else if (remainingQuestions.length === 1) {
      setRemainingQuestions([]);
      setQuestions(null);
      localStorage.removeItem("trivia-questions");
    } else {
      // try to reload from CSV if all else fails
      fetch("/cleaned_trivia.csv")
        .then((res) => res.text())
        .then((csv) => {
          const parsedCSV = parseCSV(csv);
          if (parsedCSV.length > 0) {
            const randomIdx = Math.floor(Math.random() * parsedCSV.length);
            const nextQuestion = parsedCSV[randomIdx];
            const next = [
              ...parsedCSV.slice(0, randomIdx),
              ...parsedCSV.slice(randomIdx + 1),
            ];
            setRemainingQuestions(next);
            setQuestions(nextQuestion);
            localStorage.setItem(
              "trivia-questions",
              JSON.stringify({ current: nextQuestion, remaining: next })
            );
          }
        });
    }
  };

  // State for countdown
  const [targetDate, setTargetDate] = useState<number | null>(null);
  const [timerKey, setTimerKey] = useState(0);
  const [shouldRestart, setShouldRestart] = useState(false);

  // Handler to start/restart the countdown
  const startCountdown = () => {
    setTargetDate(Date.now() + 10000); // 10 seconds from now
    setTimerKey((k) => k + 1); // Change key to force remount
  };

  //handler to stop the countdown
  const stopCountdown = () => {
    setTargetDate(null);
    setTimerKey((k) => k + 1); // Change key to force remount
  };

  const [topQueue, setTopQueue] = useState<string>("");
  const [disableBtn, setDisableBtn] = useState(true);
  const handleQueue = useCallback(
    (data: string[]) => {
      try {
        console.log("Queue update received:", data); // Debug log
        if (!data || data.length === 0) {
          setTopQueue("");
          setDisableBtn(true);
          stopCountdown();
        } else {
          setTopQueue(data[0]);
          setDisableBtn(false);
          startCountdown();
        }
      } catch (err) {
        console.error("Error handling queue top:", err);
        setError(dict.errors.FailedToUpdateQueueStatus);
      }
    },
    [dict.errors.FailedToUpdateQueueStatus]
  );

  usePusherBind(channel, "buzzer-queue", handleQueue);

  const handelCorrectAnswer = async () => {
    if (correctIsLoading) return;

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

      setRound(Round + 1);
      setShouldRestart(false);
      popQuestion();

      console.log("updated score successfully");
    } catch (error) {
      console.error("Error updating score:", error);
      setError(dict.errors.FailedToUpdateScore);
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
      setError(dict.errors.FailedToPopQueue);
    } finally {
      if (topQueue === "") {
        stopCountdown();
      }
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
      setError(dict.errors.FailedToEmptyQueue);
    } finally {
      popQuestion();
      stopCountdown();
      setSkiptIsLoading(false);
    }
  };

  // Fetch players count on mount
  useEffect(() => {
    const fetchPlayersCount = async () => {
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
          setPlayers(data.leaderboard.length);
        } else {
          setPlayers(0);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setPlayers(0);
        setError(dict.errors.FailedToFetchPlayerCount);
      }
    };
    fetchPlayersCount();
  }, [dict.errors.FailedToFetchPlayerCount, roomId]);

  // Show error state
  if (pusherError) {
    return <PusherError dict={dict} pusherError={pusherError.message} />;
  }

  return (
    <div className="w-full max-w-md bg-gray-100 rounded-lg  p-6">
      <div className="flex justify-between text-center mb-4">
        <h1 className="text-lg font-bold mb-6 text-text-primary text-start">
          {dict.round} {Round}
        </h1>
        <h1 className="text-lg font-bold mb-6 text-text-primary text-start">
          {Players} {dict.players}
        </h1>
      </div>
      <div className="flex flex-col justify-between text-center mb-4">
        <h1 className="text-xl font-bold mb-6 text-text-primary text-start">
          {dict.question}:{" "}
          {questions ? questions.question : dict.errors.noMoreQuestions}
        </h1>
        <h1 className="text-xl font-bold mb-6 text-text-primary text-start">
          {dict.answer}: {questions ? questions.answer : "-"}
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
            <ErrorAlert
              message={error}
              onDismiss={() => setError(null)}
              dict={dict}
            />
          )}
          <button
            disabled={correctIsLoading || !questions || disableBtn}
            onClick={handelCorrectAnswer}
            className="w-full bg-success text-white font-semibold py-2 rounded-lg  hover:bg-primary hover:text-white transition duration-300 transform active:scale-95"
          >
            {dict.correctAnswer}
          </button>
          <button
            disabled={wrongIsLoading || !questions || disableBtn}
            onClick={handleWrongAnswer}
            className="w-full bg-danger text-white font-semibold py-2 rounded-lg  hover:bg-primary hover:text-white transition duration-300 transform active:scale-95"
          >
            {dict.wrongAnswer}
          </button>
          <button
            disabled={skiptIsLoading || !questions}
            onClick={handleSkip}
            className="w-full bg-warning text-white font-semibold py-2 rounded-lg  hover:bg-primary hover:text-white transition duration-300 transform active:scale-95"
          >
            {dict.skipQuestion}
          </button>
        </div>
      </div>
    </div>
  );
}
