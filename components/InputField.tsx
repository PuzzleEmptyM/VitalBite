import React from "react";

interface InputFieldProps {
  type: string;
  placeholder: string;
  className?: string;
}

const InputField: React.FC<InputFieldProps> = ({ type, placeholder, className }) => (
  <input
    type={type}
    placeholder={placeholder}
    className="w-full max-w-sm p-3 border rounded-lg font-playfair font-thin text-teal placeholder-teal mb-6"
  />
);

export default InputField;
