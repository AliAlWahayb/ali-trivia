import Buzzer from "./Buzzer";
import { cookies } from "next/headers";
import { verifyToken } from "../../../lib/jwt";
import { redirect } from "next/navigation";
import Score from "./Score";
import ErrorBoundary from "@/components/ErrorBoundary";

export default async function Room({ params }: { params: { roomId: string } }) {
  const { roomId } = await params;
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;
  const payload = token ? verifyToken(token) : null;

  if (!payload || payload.role !== "player" || payload.roomId !== roomId) {
    redirect("/");
  }

  return (
    <ErrorBoundary>
      <div className="flex flex-col items-center justify-baseline  p-5 min-h-screen bg-background-light">
        <div className="flex flex-col items-center justify-center mb-8">
          <h1 className="text-4xl font-bold mb-3 text-text-primary">
            {payload?.username || "Player"}
          </h1>
          <Score roomId={roomId} username={payload?.username} />
        </div>
        <Buzzer roomId={roomId} username={payload?.username} />
      </div>
    </ErrorBoundary>
  );
}
