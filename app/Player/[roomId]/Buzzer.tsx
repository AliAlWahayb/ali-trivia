"use client";

import { useState } from "react";

export default function Buzzer() {
  const [buzzedIn, setBuzzedIn] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [yourTurn, setYourTurn] = useState(false);

  const handleBuzzIn = () => {
    setBuzzedIn(true);
    console.log("Buzzed in!");
  };

  return (
    <div className="flex flex-col min-h-screen w-full h-full bg-red-100 p-0">
      <button
        onClick={handleBuzzIn}
        className={`flex-1 w-full h-full text-white text-5xl text-center font-semibold rounded-lg transition duration-300 transform active:scale-95 ${
          buzzedIn ? (yourTurn ? "bg-success" : "bg-warning") : "bg-primary"
        } hover:bg-secondary flex items-center justify-center`}
        style={{ minHeight: "100%" }}
      >
        {buzzedIn ? (yourTurn ? "Your Turn" : "Waiting...") : "Buzz In"}
      </button>
    </div>
  );
}