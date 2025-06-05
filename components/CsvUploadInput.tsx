// components/CsvUploadInput.tsx
import React, { useRef } from 'react';
import { useFormContext } from 'react-hook-form'; // Assuming this component will be used inside a react-hook-form context

interface CsvUploadInputProps {
  id: string;
  label: string;
  onFileSelect: (file: File | null) => void;
  className?: string;
}

const CsvUploadInput: React.FC<CsvUploadInputProps> = ({ id, label, onFileSelect, className }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { register } = useFormContext(); // Use useFormContext if this is part of a larger form

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    onFileSelect(file);
  };

  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={id} className="block text-sm font-medium text-textSecondary mb-2">
        {label}
      </label>
      <input
        type="file"
        id={id}
        accept=".csv" // Restrict to CSV files
        className="hidden" // Hide the default input
        {...register(id, {
          onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
            handleChange(event);
            // Call the original react-hook-form onChange if it exists
            if (register(id).onChange) {
              register(id).onChange(event);
            }
          }
        })}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="w-full bg-backgroundLight text-primary border border-primary font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-primary hover:text-white transition duration-300 transform active:scale-95 text-center"
      >
        Upload CSV File
      </button>
      {/* Optional: Display selected file name */}
      {fileInputRef.current?.files?.[0] && (
        <p className="mt-2 text-sm text-textMuted">
          Selected: {fileInputRef.current.files[0].name}
        </p>
      )}
      <p className="mt-1 text-xs text-textMuted">
        Format: Two columns - &quot;question&quot;, &quot;answer&quot;
      </p>
    </div>
  );
};

export default CsvUploadInput;