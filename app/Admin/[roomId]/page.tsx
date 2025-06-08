import AdminAccordion from "./Accordion";
import QuestionsCard from "./QuestionsCard";
import Queue from "./Queue";
import { cookies } from "next/headers";
import { verifyToken } from "../../../lib/jwt";
import { redirect } from "next/navigation";

export default async function Room({ params }: { params: { roomId: string } }) {
  const { roomId } = await params;

  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;
  const payload = token ? verifyToken(token) : null;

  if (!payload || payload.role !== "admin" || payload.roomId !== roomId) {
    redirect("/");
  }

  return (
    <div className="flex flex-col items-center  p-5 min-h-screen bg-background-light">
      <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-800 text-sm p-3 rounded-md text-center font-medium">
        Your Room ID: <span className="font-bold text-lg">{roomId}</span>
      </div>
      <div className="flex flex-col items-center w-full max-w-3xl space-y-3">
        <QuestionsCard />
        <AdminAccordion />
        <Queue />
      </div>
    </div>
  );
}
