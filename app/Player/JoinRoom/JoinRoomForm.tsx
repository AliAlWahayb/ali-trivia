"use client";

import { useForm, FormProvider } from "react-hook-form";
import TextInput from "@/components/TextInput";
import { useRouter } from "next/navigation";

interface JoinRoomFormData {
  roomCode: string;
  name: string;
}

export default function JoinRoomForm() {
  const methods = useForm<JoinRoomFormData>({
    defaultValues: {
      roomCode: "",
      name: "",
    },
  });
  const { handleSubmit, register } = methods;
  const router = useRouter();

  const onSubmit = async (data: JoinRoomFormData) => {
    const formData = new FormData();
    formData.append("username", data.name);
    formData.append("roomId", data.roomCode);
    const res = await fetch("/api/join-room", {
      method: "POST",
      body: formData,
    });
    const result = await res.json();
    if (result.roomId) {
      console.log("Joined room successfully:", result);
      router.push(`/Player/${result.roomId}`);
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
            type="text"
            maxLength={4}
            minLength={4}
            pattern="\d*"
            required
            {...register("roomCode", {
              required: true,
              pattern: {
                value: /^\d{4}$/,
                message: "Room code must be exactly 4 digits",
              },
              validate: (value) =>
                value.length === 4 || "Room code must be exactly 4 digits",
            })}
            onInput={(e) => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              e.target.value = e.target.value.replace(/[^0-9]/g, "");
            }}
          />

          {/* Name */}
          <TextInput
            label="Your Name"
            id="name"
            placeholder="Enter your name"
            inputMode="text"
            type="text"
            maxLength={16}
            minLength={3}
            required
            {...register("name")}
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-primary text-white font-semibold py-3 rounded-lg shadow-md hover:bg-secondary transition duration-300 transform active:scale-95"
          >
            Join Room
          </button>
        </form>
      </FormProvider>
    </div>
  );
}
