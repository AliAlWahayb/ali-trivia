"use client";

import { useForm, FormProvider } from "react-hook-form";
import TextInput from "@/components/TextInput";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ErrorAlert from "@/components/ErrorAlert";
import { Dict } from "@/types/dict";
import { getCsrfToken } from "@/lib/getCsrfToken";

interface JoinRoomFormData {
  roomCode: string;
  name: string;
}

interface JoinRoomFormProps {
  lang: "ar" | "en";
  dict: Dict;
}

export default function JoinRoomForm({ dict, lang }: JoinRoomFormProps) {
  const [error, setError] = useState<string | null>(null);

  const methods = useForm<JoinRoomFormData>({
    defaultValues: {
      roomCode: "",
      name: "",
    },
  });
  const { handleSubmit, register } = methods;
  const router = useRouter();

  const onSubmit = async (data: JoinRoomFormData) => {
    try {
      // 1. Join Room API Request
      const formData = new FormData();
      formData.append("username", data.name);
      formData.append("roomId", data.roomCode);
      const roomRes = await fetch("/api/join-room", {
        method: "POST",
        body: formData,
        headers: {
          "x-csrf-token": getCsrfToken() || "",
        },
      });
      const roomResult = await roomRes.json();

      if (roomResult.error) {
        setError(dict.errors.connectionError);
        return;
      }

      // 2. Redirect to the player's room

      router.push(`/${lang}/Player/${roomResult.roomId}`);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {}
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
                message: dict.errors.roomCodeError,
              },
              validate: (value) =>
                value.length === 4 || dict.errors.roomCodeError,
            })}
            onInput={(e) => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              e.target.value = e.target.value.replace(/[^0-9]/g, "");
            }}
          />

          {/* Name */}
          <TextInput
            label={dict.yourName}
            id="name"
            placeholder={dict.enterYourName}
            inputMode="text"
            type="text"
            maxLength={16}
            minLength={3}
            required
            {...register("name")}
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
            className="w-full bg-primary text-white font-semibold py-3 rounded-lg shadow-md  transition duration-300 transform active:scale-95"
          >
            {dict.joinGame}
          </button>
        </form>
      </FormProvider>
    </div>
  );
}
