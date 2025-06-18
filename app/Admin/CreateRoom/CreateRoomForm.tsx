"use client"; // This component needs to be a client component

import { useState } from "react";
import { useForm, Controller, FormProvider } from "react-hook-form"; // Import FormProvider
import { useRouter } from "next/navigation"; // For Next.js 13+ App Router navigation

// Import the new components
import ToggleSwitch from "@/components/ToggleSwitch";
import TextInput from "@/components/TextInput";
import CsvUploadInput from "@/components/CsvUploadInput"; // New import for CSV upload

// Define the form data interface for better type safety
interface CreateRoomFormData {
  enableTimer: boolean;
  timer?: number;
  enableTeams: boolean;
  teams?: number;
  enableSound: boolean;
  enableLimitedQuestions: boolean;
  limitedQuestions?: number;
  enableCustomQuestions: boolean;
  // customQuestions will be handled by the CSV file upload
  // A FileList is what you get from a file input
  questionsCsv?: FileList;
}

export default function CreateRoomPage() {
  const router = useRouter(); // Initialize router

  const methods = useForm<CreateRoomFormData>({
    defaultValues: {
      enableTimer: false,
      enableTeams: false,
      enableSound: true, // Default to true for sound effects
      enableLimitedQuestions: false,
      enableCustomQuestions: false,
      limitedQuestions: 10, // sensible default if enabled
      teams: 2, // sensible default if enabled
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { handleSubmit, control, watch, register, setValue } = methods;

  // Watch fields to control conditional rendering
  const watchEnableTimer = watch("enableTimer");
  const watchEnableTeams = watch("enableTeams");
  const watchEnableLimitedQuestions = watch("enableLimitedQuestions");
  const watchEnableCustomQuestions = watch("enableCustomQuestions");

  // State to hold the actual selected file from CsvUploadInput
  const [selectedCsvFile, setSelectedCsvFile] = useState<File | null>(null);

  const onSubmit = async (data: CreateRoomFormData) => {
    // Clear questions from previous games
    if (localStorage.getItem("trivia-questions")) {
      localStorage.removeItem("trivia-questions");
    }

    // Clean up data based on toggles
    if (!data.enableTimer) data.timer = undefined;
    if (!data.enableTeams) data.teams = undefined;
    if (!data.enableLimitedQuestions) data.limitedQuestions = undefined;
    // customQuestions is now handled by CSV, so it's not a direct number input from form
    // Remove if it's explicitly part of `data` but not used for custom questions via CSV
    if (!data.enableCustomQuestions) {
      // You might want to unset the file if custom questions are disabled,
      // or validate that a file is present if it's enabled.
      // For now, if toggle is off, we won't send the file.
      setSelectedCsvFile(null); // Clear selected file if toggle is off
    }

    // Prepare FormData for API call, especially important for file uploads
    const formData = new FormData();
    formData.append("enableTimer", String(data.enableTimer));
    if (data.timer !== undefined) formData.append("timer", String(data.timer));
    formData.append("enableTeams", String(data.enableTeams));
    if (data.teams !== undefined) formData.append("teams", String(data.teams));
    formData.append("enableSound", String(data.enableSound));
    formData.append(
      "enableLimitedQuestions",
      String(data.enableLimitedQuestions)
    );
    if (data.limitedQuestions !== undefined)
      formData.append("limitedQuestions", String(data.limitedQuestions));
    formData.append(
      "enableCustomQuestions",
      String(data.enableCustomQuestions)
    );

    // Append the selected CSV file if custom questions are enabled and a file is selected
    if (watchEnableCustomQuestions && selectedCsvFile) {
      formData.append("questionsCsv", selectedCsvFile);
    }

    try {
      // Fetch request with FormData (Content-Type is automatically set to multipart/form-data)
      const response = await fetch("/api/create-room", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Room created successfully:", result);

      // Redirect to the admin game master dashboard using the actual roomId from the server response
      router.push(`/Admin/${result.roomId}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Failed to create room:", error);
      alert(`Failed to create room: ${error.message}`); // Basic alert for user feedback
    }
  };

  return (
    <div>
      {/* Use FormProvider to pass context to child components (like CsvUploadInput) */}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Enable Sound Toggle */}
          <Controller
            name="enableSound"
            control={control}
            render={({ field }) => (
              <ToggleSwitch
                id="enable-sound"
                label="Enable Sound Effects"
                checked={field.value}
                onChange={field.onChange} // field.onChange handles updating react-hook-form state
              />
            )}
          />

          {/* Enable Timer Toggle */}
          <Controller
            name="enableTimer"
            control={control}
            render={({ field }) => (
              <ToggleSwitch
                id="enable-timer"
                label="Enable Buzzer Timer"
                checked={field.value}
                onChange={field.onChange}
              />
            )}
          />

          {/* Timer Input (Conditional) */}
          {watchEnableTimer && (
            <TextInput
              label="Timer Duration (in seconds)"
              id="timer"
              type="number"
              min="5" // sensible minimum
              max="120" // sensible maximum
              placeholder="e.g., 30"
              required={watchEnableTimer}
              {...register("timer", { valueAsNumber: true })}
            />
          )}

          {/* Enable Teams Toggle */}
          <Controller
            name="enableTeams"
            control={control}
            render={({ field }) => (
              <ToggleSwitch
                id="enable-teams"
                label="Enable Teams Mode"
                checked={field.value}
                onChange={field.onChange}
              />
            )}
          />

          {/* Teams Input (Conditional) */}
          {watchEnableTeams && (
            <TextInput
              label="Number of Teams"
              id="teams"
              type="number"
              min="2"
              max="10"
              placeholder="e.g., 4"
              required={watchEnableTeams}
              {...register("teams", { valueAsNumber: true })}
            />
          )}

          {/* Enable Limited Questions Toggle */}
          <Controller
            name="enableLimitedQuestions"
            control={control}
            render={({ field }) => (
              <ToggleSwitch
                id="enable-limited-questions"
                label="Limit Total Questions"
                checked={field.value}
                onChange={field.onChange}
              />
            )}
          />

          {/* Limited Questions Input (Conditional) */}
          {watchEnableLimitedQuestions && (
            <TextInput
              label="Total Number of Questions"
              id="limitedQuestions"
              type="number"
              min="1"
              max="500" // Adjusted max for overall game questions
              placeholder="e.g., 20"
              required={watchEnableLimitedQuestions}
              {...register("limitedQuestions", { valueAsNumber: true })}
            />
          )}

          {/* Enable Custom Questions Toggle (for CSV upload) */}
          <Controller
            name="enableCustomQuestions"
            control={control}
            render={({ field }) => (
              <ToggleSwitch
                id="enable-custom-questions"
                label="Upload Custom Questions (CSV)"
                checked={field.value}
                onChange={(checked) => {
                  field.onChange(checked);
                  // Clear selected file if toggle is turned off
                  if (!checked) setSelectedCsvFile(null);
                }}
              />
            )}
          />

          {/* CSV Upload Input (Conditional) */}
          {watchEnableCustomQuestions && (
            <CsvUploadInput
              id="questionsCsv"
              label="Select your CSV file"
              onFileSelect={setSelectedCsvFile}
              // No need to pass register directly here thanks to FormProvider
            />
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-primary text-white font-semibold py-3 rounded-lg shadow-md hover:bg-secondary transition duration-300 transform active:scale-95"
          >
            Create Game
          </button>
        </form>
      </FormProvider>
    </div>
  );
}
