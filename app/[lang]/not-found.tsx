import Link from "next/link";
import { getDictionary } from "./dictionaries";

export default async function NotFound({
  params,
}: {
  params?: { lang?: "ar" | "en" };
} = {}) {
  const lang = params?.lang || "ar";
  const dict = await getDictionary(lang);
  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-screen  text-text-primary">
      <div className="mb-12 text-center">
        <h1 className="text-5xl sm:text-5xl font-extrabold text-secondary mb-4">
          {dict.pageNotFound}
        </h1>
        <p className="text-lg sm:text-lg text-textSecondary px-4">
          {dict.oops}
        </p>
      </div>
      <div className="flex flex-col gap-6 w-full max-w-sm">
        <Link
          href={`/${lang}`}
          className="w-full bg-secondary text-white text-center font-semibold py-4 rounded-lg  transition duration-300 transform active:scale-95"
        >
          {dict.returnHome}
        </Link>
      </div>
    </div>
  );
}
