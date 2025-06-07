import JoinRoomForm from "./JoinRoomForm";

export default function JoinRoom() {
  return (
    <div className="flex flex-col items-center  p-5 min-h-screen bg-background-light">
      <h1 className="text-4xl font-bold mb-6 text-secondary text-center">
        Join Room
      </h1>
        <JoinRoomForm />
      
    </div>
  );
}
