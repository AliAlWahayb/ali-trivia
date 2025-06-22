import React from "react";

interface ErrorAlertProps {
  dict: Record<string, string>;
  lang?: "ar" | "en";
  message: string;
  onDismiss: () => void;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({
  message,
  onDismiss,
  dict,
}) => (
  <div className="bg-red-500 text-white p-2 text-center rounded">
    {message}
    <button onClick={onDismiss} className="ml-2 text-xs underline">
      {dict.dismiss}
    </button>
  </div>
);

export default ErrorAlert;
