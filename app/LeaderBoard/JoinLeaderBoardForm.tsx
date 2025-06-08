"use client";

import { useForm, FormProvider } from "react-hook-form";
import TextInput from "@/components/TextInput";
import { useRouter } from "next/navigation";

interface JoinLeaderBoardFormData {
  roomCode: string;
}

export default function JoinLeaderBoardForm() {
  const methods = useForm<JoinLeaderBoardFormData>({
    defaultValues: {
      roomCode: "",
    },
  });

  const { handleSubmit, register } = methods;
  const router = useRouter();

  const onSubmit = async (data: JoinLeaderBoardFormData) => {
    console.log("Joining room with data:", data);

    const formData = new FormData();
    formData.append("roomId", data.roomCode);
    const res = await fetch("/api/leader-board", {
      method: "POST",
      body: formData,
    });
    const result = await res.json();
    if (result.roomId) {
      console.log("Joined room successfully:", result);
      router.push(`/LeaderBoard/${result.roomId}`);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-lg  px-6 py-3">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Room Code */}
          <TextInput
            label="Room Code"
            id="roomCode"
            placeholder="Enter Room Code"
            inputMode="numeric"
            type="number"
            required
            {...register("roomCode")}
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-primary text-white font-semibold py-3 rounded-lg shadow-md hover:bg-secondary transition duration-300 transform active:scale-95"
          >
            Join Leaderboard
          </button>
        </form>
      </FormProvider>
    </div>
  );
}
