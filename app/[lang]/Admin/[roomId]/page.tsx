import AdminAccordion from "./Accordion";
import QuestionsCard from "./QuestionsCard";
import Queue from "./Queue";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { redirect } from "next/navigation";
import BackBtn from "@/components/BackBtn";
import { getDictionary } from "../../dictionaries";

export default async function Room({
  params,
}: {
  params: Promise<{ lang: "ar" | "en"; roomId: string }>;
}) {
  const { lang, roomId } = await params;
  const dict = await getDictionary(lang);

  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;

  if (!token) {
    redirect("/");
  }

  const payload = token ? verifyToken(token) : null;

  if (!payload || payload.role !== "admin" || payload.roomId !== roomId) {
    redirect("/");
  }

  return (
    <div className="flex flex-col items-center p-5 min-h-screen bg-background-light">
      <div className="w-full max-w-xs flex flex-row items-center justify-between mb-6">
        <BackBtn role={payload.role} roomId={roomId} dict={dict} lang={lang} />
        <div className="flex-1 flex justify-center">
          <div className="bg-primary/10 border border-primary/80 text-secondary text-sm p-2 rounded-md text-center font-medium">
            {dict.yourRoomId}:{" "}
            <span className="font-bold text-lg">{roomId}</span>
          </div>
        </div>
        <div style={{ width: 40 }} />
      </div>
      <div className="flex flex-col items-center w-full max-w-3xl space-y-3">
        <QuestionsCard roomId={roomId} lang={lang} dict={dict} />
        <AdminAccordion roomId={roomId} dict={dict} lang={lang} />
        <Queue roomId={roomId} lang={lang} dict={dict} />
      </div>
    </div>
  );
}
