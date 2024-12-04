import React, { useState } from 'react';

interface RecipeCardProps {
  recipeId: number;
  prepTime: string;
  timestamp: string;
  recipeName: string;
  ingredients: string[];
  instructions: string[];
  onDelete: (recipeId: number) => void;
  uid: string;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  recipeId,
  prepTime,
  timestamp,
  recipeName,
  ingredients,
  instructions,
  onDelete,
  uid,
}) => {
  // State to control expanded view
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Format timestamp to show only month, day, and year
  const formattedDate = new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // Function to format prep time
  const formatPrepTime = (prepTime: string) => {
    const minutes = parseInt(prepTime, 10);

    if (isNaN(minutes)) {
      return prepTime;
    }

    if (minutes < 60) {
      return `${minutes} minutes`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      if (remainingMinutes === 0) {
        return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
      } else {
        return `${hours} ${hours === 1 ? 'hour' : 'hours'} ${remainingMinutes} minutes`;
      }
    }
  };

  // Function to handle card click
  const handleCardClick = () => {
    setIsExpanded((prev) => !prev);
  };

  // Function to handle recipe deletion
  const handleDelete = async () => {
    console.log('Attempting to delete recipe with recipeId:', recipeId);
    console.log('User ID (uid):', uid);

    if (!confirm('Are you sure you want to delete this recipe?')) {
      return;
    }

    setIsDeleting(true);

    try {
      const deleteUrl = `/api/recipes?uid=${uid}&rid=${recipeId}`;
      console.log('DELETE URL:', deleteUrl);

      const response = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        onDelete(recipeId); // Update parent component state
      } else {
        const data = await response.json();
        alert(`Error deleting recipe: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting recipe:', error);
      alert('An error occurred while deleting the recipe.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Recipe Card */}
      <div
        className={`bg-mint rounded-3xl border border-forest_green shadow-md w-full max-w-md mx-auto mb-4 cursor-pointer transition-all duration-300 ${
          isExpanded ? 'p-6' : 'p-4'
        }`}
        onClick={handleCardClick}
      >
        <div className="flex justify-between mb-2">
          <p className="text-forest_green font-medium">
            Prep: {formatPrepTime(prepTime)}
          </p>
          <p className="text-forest_green font-medium">Date: {formattedDate}</p>
        </div>
        <h3 className="text-xl font-bold text-center text-forest_green">
          {recipeName}
        </h3>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="mt-4">
            <p className="text-forest_green font-bold text-xl mb-2">
              Ingredients:
            </p>
            <ul className="list-disc list-inside text-forest_green mb-4">
              {ingredients.map((ingredient, index) => (
                <li key={index} className="mb-1">
                  {ingredient}
                </li>
              ))}
            </ul>

            <p className="text-forest_green font-bold text-xl mb-2">
              Instructions:
            </p>
            <ol className="list-decimal list-inside text-forest_green mb-4">
              {instructions.map((instruction, index) => (
                <li key={index} className="mb-2">
                  {instruction.trim().endsWith('.')
                    ? instruction.trim()
                    : `${instruction.trim()}.`}
                </li>
              ))}
            </ol>

            {/* Delete Button */}
            <div className="flex justify-center mt-4">
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click
                  handleDelete();
                }}
                disabled={isDeleting}
                className="bg-pink-900 hover:bg-pink-800 text-white font-bold py-2 px-4 rounded-full w-1/2"
              >
                {isDeleting ? 'Deleting...' : 'Delete Recipe'}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default RecipeCard;
