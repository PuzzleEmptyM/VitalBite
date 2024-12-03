import React, { useState, useEffect } from "react";

// Define the conditions and their corresponding diet IDs
const conditions = [
  { name: "Celiac", dietId: 1 },               // Diet: GlutenFree
  { name: "IBS", dietId: 2 },                  // Diet: LowFodmap
  { name: "Cardiovascular Diseases", dietId: 3 }, // Diet: Mediterranean
  { name: "Hypertension", dietId: 4 },         // Diet: DASH
  { name: "Autoimmune Diseases", dietId: 5 },  // Diet: Anti-inflammatory
  { name: "Type 2 Diabetes", dietId: 6 },      // Diet: LowCalLowFat
];

interface ConditionSelectorProps {
  onSelectConditions: (selectedDiets: number[]) => void;
  initialSelectedConditions?: number[];
  isEditMode?: boolean;
}

const ConditionSelector: React.FC<ConditionSelectorProps> = ({ onSelectConditions, initialSelectedConditions = [], isEditMode = false }) => {
  const [selectedConditions, setSelectedConditions] = useState<number[]>([]);

  // Set initial selected conditions when the component mounts
  useEffect(() => {
    if (isEditMode && initialSelectedConditions.length > 0) {
      setSelectedConditions(initialSelectedConditions);
    }
  }, [initialSelectedConditions, isEditMode]);

  // Function to handle selecting or deselecting a condition
  const handleConditionClick = (dietId: number) => {
    setSelectedConditions((prevSelected) =>
      prevSelected.includes(dietId)
        ? prevSelected.filter((item) => item !== dietId)
        : [...prevSelected, dietId]
    );
  };

  // Pass the selected diet IDs to the parent component whenever they change
  useEffect(() => {
    onSelectConditions(selectedConditions);
  }, [selectedConditions, onSelectConditions]);

  return (
    <div className="grid grid-cols-2 gap-6 mt-4">
      {conditions.map((condition) => (
        <button
          key={condition.dietId}
          type="button"
          className={`py-2 px-2 border border-gray-300 shadow-md text-teal font-playfair font-normal rounded-md hover:bg-mint hover:text-white ${
            selectedConditions.includes(condition.dietId) ? "bg-mint text-white" : initialSelectedConditions.includes(condition.dietId) ? "bg-gray-300 text-gray-700" : ""
          }`}
          onClick={() => handleConditionClick(condition.dietId)}
        >
          {condition.name}
        </button>
      ))}
    </div>
  );
};

export default ConditionSelector;
