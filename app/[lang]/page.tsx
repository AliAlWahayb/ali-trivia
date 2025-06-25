import CreateGame from "@/components/CreateGame";
import Link from "next/link";
import { getDictionary } from "./dictionaries";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: "ar" | "en" }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-screen bg-backgroundLight text-textPrimary">
      <div className="mb-12 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-primary mb-4">
          {dict.welcome}
        </h1>
        <p className="text-lg sm:text-xl text-textSecondary px-4">
          {dict.testYourKnowledge}
        </p>
      </div>

      <div className="flex flex-col gap-6 w-full max-w-sm">
        <Link
          href={`/${lang}/Player/JoinRoom`}
          className="w-full bg-primary text-white text-center font-semibold py-4 rounded-lg  hover:bg-secondary transition duration-300 transform active:scale-95"
        >
          {dict.joinGame}
        </Link>

        <Link
          href={`/${lang}/LeaderBoard`}
          className="w-full bg-backgroundLight text-primary text-center font-semibold border-2 border-primary py-4 rounded-lg  hover:bg-primary hover:text-white transition duration-300 transform active:scale-95"
        >
          {dict.leaderboard}
        </Link>
        <CreateGame lang={lang} dict={dict} />
      </div>
    </div>
  );
}
