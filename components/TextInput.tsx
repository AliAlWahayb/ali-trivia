// components/TextInput.tsx
import React from "react";

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  dict?: Record<string, string>;
  // All other input props like type, placeholder, required, etc., are passed via ...props
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  id,
  className,
  dict,
  ...props
}) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-textSecondary mb-2"
      >
        {dict ? dict[label] || label : label}
      </label>
      <input
        id={id}
        className={`w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 ${className}`}
        placeholder={
          dict && props.placeholder
            ? dict[props.placeholder] || props.placeholder
            : props.placeholder
        }
        {...props}
      />
    </div>
  );
};

export default TextInput;
