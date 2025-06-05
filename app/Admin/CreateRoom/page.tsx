import CreateRoomForm from "./CreateRoomForm";


export default function CreateRoom() {

  return (
    <div className="flex flex-col items-center  p-5 min-h-screen bg-background-light">
      <h1 className="text-4xl font-bold mb-6 text-text-primary text-center">
        Create Room
      </h1>
      
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-text-primary text-start">
          Game Settings
        </h1>
        <CreateRoomForm  />
      </div>
    </div>
  );
}
