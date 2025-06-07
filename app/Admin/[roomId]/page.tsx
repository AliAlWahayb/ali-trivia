import AdminAccordion from "./Accordion";
import QuestionsCard from "./QuestionsCard";
import Queue from "./Queue";

export default async function Room({ params }: { params: { roomId: string } }) {
  const { roomId } = await params;

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
