import BackBtn from "@/components/BackBtn";
import JoinRoomForm from "./JoinRoomForm";
import { getDictionary } from "../../dictionaries";

export default async function JoinRoom({
  params,
}: {
  params: Promise<{ lang: "ar" | "en" }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return (
    <div className="flex flex-col items-center  p-5 min-h-screen bg-background-light">
      <div className="w-full max-w-xs flex flex-row items-center justify-between mb-6">
        <BackBtn noConfirm dict={dict} lang={lang} />
        <div className="flex-1 flex justify-center">
          <h1 className="text-4xl font-bold  text-secondary text-center">
            {dict.joinRoom}
          </h1>
        </div>
        <div style={{ width: 40 }} />
      </div>
      <JoinRoomForm lang={lang} dict={dict} />
    </div>
  );
}
