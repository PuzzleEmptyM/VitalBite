import React from "react";

interface InputFieldProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const InputField: React.FC<InputFieldProps> = ({ type, placeholder, value, onChange, className }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`w-full max-w-sm p-3 border rounded-lg font-playfair font-thin text-teal placeholder-teal mb-6 ${className}`}
  />
);

export default InputField;
