"use client";
import { useState } from "react";

const Queue = () => {
  // Example dynamic queue data (displayed as is, not sorted)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [queue, setQueue] = useState<string[]>([
    "alisaw11",
    "Sara",
    "John",
    "Lina",
  ]);

  return (
    <div className="w-full max-w-md bg-gray-100 rounded-lg px-6 py-3 ">
      <div className="flex flex-row justify-between ">
        <p className="text-text-primary font-semibold text-lg">Buzzer Queue</p>
      </div>

      <div className="mt-4">
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
