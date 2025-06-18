import Buzzer from "./Buzzer";
import { cookies } from "next/headers";
import { verifyToken } from "../../../lib/jwt";
import { redirect } from "next/navigation";
import Score from "./Score";
import ErrorBoundary from "@/components/ErrorBoundary";
import DynamicText from "@/components/DynamicText";
import BackBtn from "@/components/BackBtn";

export default async function Room({ params }: { params: { roomId: string } }) {
  const { roomId } = await params;
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
    <ErrorBoundary>
      <div className="flex flex-col items-center justify-baseline  p-5 min-h-screen bg-background-light">
        <div className="w-full flex flex-col items-center justify-center mb-8">
          <div className="w-full max-w-xs flex flex-row items-center justify-between mb-6">
            <BackBtn  role={payload.role} name={payload?.player} roomId={roomId} />
            <div className="flex-1 flex items-center justify-center text-center">
              <DynamicText text={payload?.player || "Unknown"} />
            </div>
            <div style={{ width: 40 }} />
          </div>
          <Score roomId={roomId} username={payload?.player} />
        </div>
        <Buzzer roomId={roomId} username={payload?.player} />
      </div>
    </ErrorBoundary>
  );
}
