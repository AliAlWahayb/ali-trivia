"use client";

import { useForm, FormProvider } from "react-hook-form";
import TextInput from "@/components/TextInput";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ErrorAlert from "@/components/ErrorAlert";
import { Dict } from "@/types/dict";

interface JoinLeaderBoardFormData {
  roomCode: string;
}

interface JoinLeaderBoardFormProps {
  lang: "ar" | "en";
  dict: Dict;
}

export default function JoinLeaderBoardForm({
  lang,
  dict,
}: JoinLeaderBoardFormProps) {
  const [error, setError] = useState<string | null>(null);

  const methods = useForm<JoinLeaderBoardFormData>({
    defaultValues: {
      roomCode: "",
    },
  });

  const { handleSubmit, register } = methods;
  const router = useRouter();

  const onSubmit = async (data: JoinLeaderBoardFormData) => {
    const formData = new FormData();
    formData.append("roomId", data.roomCode);
    const res = await fetch("/api/leader-board", {
      method: "POST",
      body: formData,
    });
    const result = await res.json();
    if (result.error) {
      setError(dict.errors.connectionError);
      return;
    }
    router.push(`/${lang}/LeaderBoard/${data.roomCode}`);
  };

  return (
    <div className="w-full max-w-md bg-white rounded-lg  px-6 py-3">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Room Code */}
          <TextInput
            label={dict.roomCode}
            id="roomCode"
            placeholder={dict.enterRoomCode}
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

          {error && (
            <ErrorAlert
              message={error}
              onDismiss={() => setError(null)}
              dict={dict}
            />
          )}
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-primary text-white font-semibold py-3 rounded-lg shadow-md hover:bg-secondary transition duration-300 transform active:scale-95"
          >
            {dict.joinLeaderboard}
          </button>
        </form>
      </FormProvider>
    </div>
  );
}
