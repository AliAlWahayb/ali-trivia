import Link from "next/link";
import { getDictionary } from "../dictionaries";

export default async function NotFoundPage({
  params,
}: {
  params: Promise<{ lang: "ar" | "en" }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-screen bg-background-light  text-text-primary">
      <div className="mb-12 text-center ">
        <div className="flex flex-col items-center justify-center mb-4">
          <span className="text-7xl font-extrabold text-secondary ">404</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-secondary mt-2 mb-2">
            {dict.pageNotFound}
          </h1>
        </div>
        <p className="text-lg sm:text-xl text-text-secondary px-4 mb-2">
          {dict.oops}
        </p>
      </div>
      <div className="flex flex-col gap-6 w-full max-w-sm">
        <Link
          href={`/${lang}`}
          className="w-full bg-secondary text-white text-center font-semibold py-4 rounded-lg   transition duration-300 transform active:scale-95"
        >
          {dict.returnHome}
        </Link>
      </div>
    </div>
  );
}
