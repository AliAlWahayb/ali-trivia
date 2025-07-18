import Buzzer from "./Buzzer";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { redirect } from "next/navigation";
import Score from "./Score";
import ErrorBoundary from "@/components/ErrorBoundary";
import DynamicText from "@/components/DynamicText";
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

  if (!payload || payload.role !== "player" || payload.roomId !== roomId) {
    redirect("/");
  }

  return (
    <ErrorBoundary lang={lang} dict={dict}>
      <div className="flex flex-col items-center justify-baseline  p-5 min-h-1/4 max-h-1/4 h-1/4 bg-background-light">
        <div className="w-full flex flex-col items-center justify-center mb-2">
          <div className="w-full max-w-xs flex flex-row items-center justify-between mb-1">
            <BackBtn
              role={payload.role}
              name={payload?.player}
              roomId={roomId}
              dict={dict}
              lang={lang}
            />
            <div className="flex-1 flex items-center justify-center text-center">
              <DynamicText
                text={payload?.player || dict.errors.UnknownPlayer}
              />
            </div>
            <div style={{ width: 40 }} />
          </div>
          <Score
            roomId={roomId}
            username={payload?.player}
            lang={lang}
            dict={dict}
          />
        </div>
        <Buzzer
          roomId={roomId}
          username={payload?.player}
          lang={lang}
          dict={dict}
        />
      </div>
    </ErrorBoundary>
  );
}
