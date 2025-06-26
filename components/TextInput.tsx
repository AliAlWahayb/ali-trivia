import React from "react";

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  dict?: Record<string, string>;
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
        className="block text-sm font-medium text-text-secondary mb-2"
      >
        {dict ? dict[label] || label : label}
      </label>
      <input
        id={id}
        className={`w-full p-3 border border-muted rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors duration-200 ${className}`}
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
