"use client";
import { Dict } from "@/types/dict";
import { usePathname, useRouter } from "next/navigation";

interface RealFooterProps {
  lang: "ar" | "en";
  dict: Dict;
}

export default function RealFooter({ lang, dict }: RealFooterProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Switch lang in the URL
  function switchLang() {
    const newLang = lang === "ar" ? "en" : "ar";
    // Replace the first segment (lang) in the path
    const segments = pathname.split("/");
    if (segments[1] === "ar" || segments[1] === "en") {
      segments[1] = newLang;
    } else {
      segments.splice(1, 0, newLang);
    }
    router.push(segments.join("/"));
  }

  return (
    <footer className="w-full bg-background-light">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="relative flex bg-gray-200 rounded-full shadow-inner w-32 h-8 overflow-hidden">
            <button
              onClick={() => lang !== "ar" && switchLang()}
              className={`flex-1 text-xs font-semibold rounded-full transition-all duration-200 h-full focus:outline-none ${
                lang === "ar"
                  ? "bg-primary text-white shadow"
                  : "bg-transparent text-gray-700 hover:bg-gray-300"
              }`}
              aria-pressed={lang === "ar"}
              aria-label="عربي"
              style={{ padding: "0 0.5rem" }}
            >
              عربي
            </button>
            <button
              onClick={() => lang !== "en" && switchLang()}
              className={`flex-1 text-xs font-semibold rounded-full transition-all duration-200 h-full focus:outline-none ${
                lang === "en"
                  ? "bg-primary text-white shadow"
                  : "bg-transparent text-gray-700 hover:bg-gray-300"
              }`}
              aria-pressed={lang === "en"}
              aria-label="English"
              style={{ padding: "0 0.5rem" }}
            >
              English
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center text-center flex-1">
          <span className="text-gray-500 text-sm">
            {dict.createdBy}{" "}
            <a
              href="https://www.linkedin.com/in/alialwahayb/"
              className="text-primary underline hover:text-primary-dark"
              target="_blank"
            >
              {dict.alialwahayb}
            </a>
          </span>
          <span className="text-gray-400 text-xs mt-1">
             1.0.0
          </span>
        </div>
      </div>
    </footer>
  );
}
