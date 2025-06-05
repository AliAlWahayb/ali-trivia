// components/TextInput.tsx
import React from 'react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  // All other input props like type, placeholder, required, etc., are passed via ...props
}

const TextInput: React.FC<TextInputProps> = ({ label, id, className, ...props }) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-textSecondary mb-2">
        {label}
      </label>
      <input
        id={id}
        className={`w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 ${className}`}
        {...props}
      />
    </div>
  );
};

export default TextInput;