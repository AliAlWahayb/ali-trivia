"use client";

import { useState } from "react";
import Countdown, { zeroPad } from "react-countdown";

export default function QuestionsCard() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [Round, setRound] = useState(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [Players, setPlayers] = useState(3);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [questions, setQuestions] = useState({
    id: 1,
    question: "What is the capital of France?",
    answer: "Paris",
  });

  // State for countdown
  const [targetDate, setTargetDate] = useState<number | null>(null);
  const [timerKey, setTimerKey] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [shouldRestart, setShouldRestart] = useState(false);

  // Handler to start/restart the countdown
  const startCountdown = () => {
    setTargetDate(Date.now() + 10000); // 10 seconds from now
    setTimerKey((k) => k + 1); // Change key to force remount
  };

  return (
    <div className="w-full max-w-md bg-gray-100 rounded-lg shadow-lg p-6">
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
        <button
          onClick={startCountdown}
          className="w-full bg-success text-white font-semibold py-2 rounded-lg shadow-lg hover:bg-primary hover:text-white transition duration-300 transform active:scale-95"
        >
          Correct Answer
        </button>
        <button className="w-full bg-danger text-white font-semibold py-2 rounded-lg shadow-lg hover:bg-primary hover:text-white transition duration-300 transform active:scale-95">
          Wrong Answer
        </button>
        <button className="w-full bg-warning text-white font-semibold py-2 rounded-lg shadow-lg hover:bg-primary hover:text-white transition duration-300 transform active:scale-95">
          Skip Question
        </button>
      </div>
    </div>
  );
}
