import { cookies } from "next/headers";
import { verifyToken } from "../../../lib/jwt";
import { redirect } from "next/navigation";
import Players from "./players";
import BackBtn from "@/components/BackBtn";

export default async function LeaderBoard({
  params,
}: {
  params: { roomId: string };
}) {
  const { roomId } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/");
  }

  const payload = token ? verifyToken(token) : null;

  if (!payload || payload.role !== "spectator" || payload.roomId !== roomId) {
    redirect("/");
  }

  return (
    <div className="flex flex-col items-center p-5 min-h-screen bg-background-light">
      <div className="w-full max-w-xs flex flex-row items-center justify-between mb-6">
        <BackBtn role={payload.role} roomId={roomId} />
        <div className="flex-1 flex justify-center">
          <h1 className="text-4xl font-bold  text-secondary text-center">
            Leaderboard
          </h1>
        </div>
        <div style={{ width: 40 }} />
      </div>
      <div className="flex flex-col justify-between text-lg items-center mb-2 pb-1 w-full px-4">
        <div className="flex justify-between text-lg items-center mb-2 pb-1 w-full px-4">
          <p className="text-text-primary font-bold">Name</p>
          <p className="text-text-primary font-bold">Points</p>
        </div>
        <Players roomId={roomId} />
      </div>
    </div>
  );
}
