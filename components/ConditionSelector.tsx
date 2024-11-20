import React from "react";

const conditions = [
  "Condition",
  "Condition",
  "Condition",
  "Condition",
  "Condition",
  "No Condition",
];

const ConditionSelector: React.FC = () => (
  <div className="grid grid-cols-2 gap-6 mt-4">
    {conditions.map((condition, index) => (
      <button
        key={index}
        className="py-2 px-4 border border-gray-300 shadow-md text-teal font-playfair font-normal rounded-md hover:bg-teal hover:text-white"
      >
        {condition}
      </button>
    ))}
  </div>
);

export default ConditionSelector;
