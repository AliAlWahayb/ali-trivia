import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import RealFooter from "@/components/RealFooter";
import { getDictionary } from "./dictionaries";
import SetCsrfCookie from "./set-csrf-cookie.client";
import { SpeedInsights } from "@vercel/speed-insights/next";
import KeepAwake from "@/components/KeepAwake";

// Dynamic metadata based on language
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: "ar" | "en" }>;
}) {
  const meta = {
    en: {
      title: "Ali Trivia Game",
      description: "A fun trivia game for everyone!",
    },
    ar: {
      title: "لعبة اسئلة علي",
      description: "لعبة اسئلة ممتعة للجميع!",
    },
  };
  const { lang } = await params;
  return {
    title: meta[lang].title,
    description: meta[lang].description,
  };
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateStaticParams() {
  return [{ lang: "ar" }, { lang: "en" }];
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: "ar" | "en" }>;
}>) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return (
    <html lang={lang} dir={lang === "ar" ? "rtl" : "ltr"}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SetCsrfCookie />
        <KeepAwake />
        {children}
        <SpeedInsights />
        <RealFooter lang={lang} dict={dict} />
      </body>
    </html>
  );
}
