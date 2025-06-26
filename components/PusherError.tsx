import { Dict } from "../types/dict";

interface PusherError {
  dict: Dict;
  lang?: "ar" | "en";
  pusherError: string;
}

const PusherError = ({ dict, pusherError }: PusherError) => {
  return (
    <div className="flex flex-col min-h-screen w-full h-full bg-danger p-4 items-center justify-center">
      <div className="bg-danger text-white p-4 rounded-lg text-center max-w-md">
        <h3 className="font-bold mb-2">{dict.errors.connectionError}</h3>
        <p className="mb-4">{pusherError}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-white text-danger px-4 py-2 rounded "
        >
          {dict.refreshPage}
        </button>
      </div>
    </div>
  );
};

export default PusherError;
