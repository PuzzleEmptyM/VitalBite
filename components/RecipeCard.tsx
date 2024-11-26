import React from 'react';

interface RecipeCardProps {
  prepTime: string;
  timestamp: string; // timestamp as string
  recipeName: string;
  ingredients: string[];  // ingredients is an array of strings
  instructions: string[]; // instructions is an array of strings
}

const RecipeCard: React.FC<RecipeCardProps> = ({ prepTime, timestamp, recipeName, ingredients, instructions }) => {
  // Format timestamp to show only month, day, and year
  const formattedDate = new Date(timestamp).toLocaleDateString("en-US", {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // Map over ingredients array to display each ingredient on a new line
  const ingredientList = ingredients.map((ingredient, index) => (
    <p key={index} className="text-forest_green mb-1">{ingredient}</p>
  ));

  // Map over instructions array to display each instruction on a new line with a period and space
  const instructionList = instructions.map((instruction, index) => (
    <p key={index} className="text-forest_green mb-2">
      {instruction.trim().endsWith('.') ? instruction.trim() : `${instruction.trim()}. `}
    </p>
  ));

  return (
    <div className="bg-mint p-4 rounded-3xl border border-forest_green shadow-md max-w-xl mx-auto mb-6"
        onClick={() => alert('Detailed Recipe')}>
      <div className="flex justify-between space-x-3 mb-2">
        <p className="text-forest_green font-medium">Prep: {prepTime}</p>
        <p className="text-forest_green font-medium">Date: {formattedDate}</p> {/* Replaced startTime with formattedDate */}
      </div>
      <h3 className="text-lg font-bold text-center text-forest_green mb-2">{recipeName}</h3>
      <p className="text-forest_green font-bold mb-1">Ingredients:</p>
      {ingredientList}
      <p className="text-forest_green font-bold mb-1">Instructions:</p>
      {instructionList}
    </div>
  );
};

export default RecipeCard;
