import QuestionsCard from "./QuestionsCard";

export default async function Room({ params }: { params: { roomId: string } }) {
  const { roomId } = await params;

  return (
    <div className="flex flex-col items-center  p-5 min-h-screen bg-background-light">
      <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-800 text-sm p-3 rounded-md text-center font-medium">
        Your Room ID: <span className="font-bold text-lg">{roomId}</span>
      </div>
      <QuestionsCard />
    </div>
  );
}
