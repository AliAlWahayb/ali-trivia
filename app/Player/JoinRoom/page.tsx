import BackBtn from "@/components/BackBtn";
import JoinRoomForm from "./JoinRoomForm";

export default function JoinRoom() {
  return (
    <div className="flex flex-col items-center  p-5 min-h-screen bg-background-light">
      <div className="w-full max-w-xs flex flex-row items-center justify-between mb-6">
        <BackBtn noConfirm />
        <div className="flex-1 flex justify-center">
          <h1 className="text-4xl font-bold  text-secondary text-center">
            Join Room
          </h1>
        </div>
        <div style={{ width: 40 }} />
      </div>

      <JoinRoomForm />
    </div>
  );
}
