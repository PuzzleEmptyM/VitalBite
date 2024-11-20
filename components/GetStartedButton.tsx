import React from "react";

interface ButtonProps {
  text: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ text, onClick }) => (
  <button
    onClick={onClick}
    className="w-full h-10 mt-4 text-center text-white bg-teal rounded-md font-playfair"
  >
    {text}
  </button>
);

export default Button;
