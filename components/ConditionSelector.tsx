import React from "react";

const conditions = [
  "Diet",
  "Diet",
  "Diet",
  "Diet",
  "Diet",
  "No Diet",
];

const ConditionSelector: React.FC = () => (
  <div className="grid grid-cols-2 gap-6 mt-4">
    {conditions.map((condition, index) => (
      <button
        key={index}
        className="py-2 px-4 border border-gray-300 shadow-md text-teal font-playfair font-normal rounded-md hover:bg-forest_green hover:text-white"
        onClick={() => alert("Diet selected")}
      >
        {condition}
      </button>
    ))}
  </div>
);

export default ConditionSelector;
