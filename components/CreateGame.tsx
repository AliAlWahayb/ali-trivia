"use client";

import { Dict } from "@/types/dict";
import { useRouter } from "next/navigation";
import { getCsrfToken } from "@/lib/getCsrfToken";

interface CreateGameProps {
  lang: "ar" | "en";
  dict: Dict;
}

const CreateGame = ({ dict, lang }: CreateGameProps) => {
  const router = useRouter();
  const onSubmit = async () => {
    // Clear questions from previous games
    if (localStorage.getItem("trivia-questions")) {
      localStorage.removeItem("trivia-questions");
    }
    try {
      const response = await fetch("/api/create-room", {
        method: "POST",
        headers: {
          "x-csrf-token": getCsrfToken() || "",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.statusText}`);
      }

      const result = await response.json();

      router.push(`/${lang}/Admin/${result.roomId}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    } catch (error: any) {
    }
  };

  return (
    <button
      onClick={onSubmit}
      className="w-full bg-backgroundLight text-primary text-center font-semibold border-2 border-primary py-4 rounded-lg  hover:bg-primary hover:text-white transition duration-300 transform active:scale-95"
    >
      {dict.createGame}
    </button>
  );
};

export default CreateGame;
