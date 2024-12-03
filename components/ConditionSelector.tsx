import axios from "axios";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

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
  onDeleteCondition?: (dietId: number) => void;
}

const ConditionSelector: React.FC<ConditionSelectorProps> = ({ onSelectConditions, initialSelectedConditions = [], isEditMode = false, onDeleteCondition }) => {
  const [selectedConditions, setSelectedConditions] = useState<number[]>([]);
  const { data: session } = useSession();

  // Set initial selected conditions when the component mounts
  useEffect(() => {
    if (isEditMode && initialSelectedConditions.length > 0) {
      setSelectedConditions(initialSelectedConditions);
    }
  }, [initialSelectedConditions, isEditMode]);

  // Function to handle selecting or deselecting a condition
  const handleConditionClick = async (dietId: number) => {
    if (selectedConditions.includes(dietId)) {
        // If already selected and is in edit mode, handle delete
        if (isEditMode && initialSelectedConditions.includes(dietId)) {
            if (onDeleteCondition) {
                await onDeleteCondition(dietId); // Wait for the delete operation to complete
                setSelectedConditions((prevSelected) => prevSelected.filter((item) => item !== dietId));
            }
        } else {
            // Remove from selected conditions
            setSelectedConditions((prevSelected) => prevSelected.filter((item) => item !== dietId));
        }
    } else {
        // Add if not already selected
        setSelectedConditions((prevSelected) => [...prevSelected, dietId]);
        // If in edit mode, add diet in real-time
        if (isEditMode) {
            try {
                if (session && session.user && session.user.id) {
                    await axios.post(`/api/preferences?uid=${session.user.id}`, {
                        diets: [...selectedConditions, dietId],
                    });
                }
            } catch (error) {
                console.error("Failed to add diet:", error);
                alert("An error occurred while adding the diet. Please try again.");
            }
        }
    }
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
