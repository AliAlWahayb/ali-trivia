"use client";

import { useState } from "react";

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
        <h1 className="text-6xl font-bold mb-6 text-secondary text-center">00:30</h1>
        <button className="w-full bg-success text-white font-semibold py-2 rounded-lg shadow-lg hover:bg-primary hover:text-white transition duration-300 transform active:scale-95">
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
