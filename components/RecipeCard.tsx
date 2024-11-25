import React from 'react';

interface RecipeCardProps {
  prepTime: string;
  startTime: string;
  recipeName: string;
  ingredients: string;
  instructions: string;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ prepTime, startTime, recipeName, ingredients, instructions }) => {
  return (
    <div className="bg-mint p-4 rounded-3xl border border-forest_green shadow-md max-w-xl mx-auto mb-6"
        onClick={() => alert('Detailed Recipe')}>
      <div className="flex justify-between space-x-3 mb-2">
        <p className="text-forest_green font-medium">Prep: {prepTime}</p>
        <p className="text-forest_green font-medium">Time: {startTime}</p>
      </div>
      <h3 className="text-lg font-bold text-center text-forest_green mb-2">{recipeName}</h3>
      <p className="text-forest_green font-medium mb-1">Ingredients:</p>
      <p className="text-forest_green mb-2">{ingredients}</p>
      <p className="text-forest_green font-medium mb-1">Instructions:</p>
      <p className="text-forest_green">{instructions}</p>
    </div>
  );
};

export default RecipeCard;