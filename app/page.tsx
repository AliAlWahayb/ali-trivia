import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-screen bg-backgroundLight text-textPrimary">
      <div className="mb-12 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-primary mb-4">
          Welcome to Ali Trivia Game
        </h1>
        <p className="text-lg sm:text-xl text-textSecondary px-4">
          Test your knowledge with a fun real-time trivia game!
        </p>
      </div>

      <div className="flex flex-col gap-6 w-full max-w-sm">
        <Link
          href="/join-game"
          className="w-full bg-primary text-white text-center font-semibold py-4 rounded-lg  hover:bg-secondary transition duration-300 transform active:scale-95"
        >
          Join Game
        </Link>

        <Link
          href="/create-game"
          className="w-full bg-backgroundLight text-primary text-center font-semibold border-2 border-primary py-4 rounded-lg  hover:bg-primary hover:text-white transition duration-300 transform active:scale-95"
        >
          Create Game
        </Link>
      </div>
    </div>
  );
}
