import { Dict } from "@/types/dict";
import React from "react";

interface ErrorAlertProps {
  dict: Dict;
  lang?: "ar" | "en";
  message: string;
  onDismiss: () => void;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({
  message,
  onDismiss,
  dict,
}) => (
  <div className="bg-danger text-white p-2 text-center rounded">
    {message}
    <button onClick={onDismiss} className="mx-2 text-xs underline">
      {dict.dismiss}
    </button>
  </div>
);

export default ErrorAlert;
