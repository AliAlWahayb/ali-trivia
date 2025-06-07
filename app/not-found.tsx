import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-screen bg-backgroundLight text-textPrimary">
      <div className="mb-12 text-center">
        <h1 className="text-5xl sm:text-5xl font-extrabold text-secondary mb-4">
          Page Not Found
        </h1>
        <p className="text-lg sm:text-lg text-textSecondary px-4">
          Oops! Something went wrong.
        </p>
      </div>

      <div className="flex flex-col gap-6 w-full max-w-sm">

        <Link
          href="/"
          className="w-full bg-secondary text-white text-center font-semibold py-4 rounded-lg  hover:bg-secondary transition duration-300 transform active:scale-95"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
