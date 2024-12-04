import React, { useState, useRef } from 'react';

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
  uid, // Destructure uid
}) => {
  // State to control modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Refs to track touch positions (for modal behavior)
  const touchStartY = useRef<number | null>(null);
  const touchCurrentY = useRef<number | null>(null);

  // Format timestamp to show only month, day, and year
  const formattedDate = new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // Function to format prep time
  const formatPrepTime = (prepTime: string) => {
    // Try to parse prepTime into a number of minutes
    const minutes = parseInt(prepTime, 10);

    if (isNaN(minutes)) {
      // If parsing fails, return the original prepTime string
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

  // Map over ingredients array to display each ingredient
  const ingredientList = ingredients.map((ingredient, index) => (
    <li key={index} className="mb-1">{ingredient}</li>
  ));

  // Map over instructions array to display each instruction
  const instructionList = instructions.map((instruction, index) => (
    <li key={index} className="mb-2">
      {instruction.trim().endsWith('.') ? instruction.trim() : `${instruction.trim()}.`}
    </li>
  ));

  // Function to handle card click
  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  // Function to handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Functions to handle touch events for scroll detection
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchCurrentY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (touchStartY.current === null || touchCurrentY.current === null) {
      handleCloseModal();
      return;
    }

    const touchDifference = Math.abs(touchStartY.current - touchCurrentY.current);

    // If the touch movement is less than a threshold, consider it a tap
    if (touchDifference < 5) {
      handleCloseModal();
    }

    // Reset touch positions
    touchStartY.current = null;
    touchCurrentY.current = null;
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
        setIsModalOpen(false); // Close the modal
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
        className="bg-mint p-4 rounded-3xl border border-forest_green shadow-md max-w-md w-full mx-auto mb-6 cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="flex justify-between space-x-3 mb-2">
          <p className="text-forest_green font-medium">
            Prep: {formatPrepTime(prepTime)}
          </p>
          <p className="text-forest_green font-medium">Date: {formattedDate}</p>
        </div>
        <h3 className="text-xl font-bold text-center text-forest_green">{recipeName}</h3>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-mint rounded-3xl p-6 max-w-2xl w-full mx-4 my-8 overflow-y-auto relative"
            onClick={handleCloseModal}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="flex justify-between mb-4">
              <p className="text-forest_green font-medium text-lg">
                Prep: {formatPrepTime(prepTime)}
              </p>
              <p className="text-forest_green font-medium text-lg">Date: {formattedDate}</p>
            </div>
            <h3 className="text-3xl font-bold text-center text-forest_green mb-6">
              {recipeName}
            </h3>

            <p className="text-forest_green font-bold text-2xl mb-4">Ingredients:</p>
            <ul className="list-disc list-inside text-lg text-forest_green mb-6">
              {ingredientList}
            </ul>

            <p className="text-forest_green font-bold text-2xl mb-4">Instructions:</p>
            <ol className="list-decimal list-inside text-lg text-forest_green">
              {instructionList}
            </ol>
            {/* Delete Button */}
            <div className='flex justify-center mt-6'>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                disabled={isDeleting}
                className="bg-pink-900 hover:bg-pink-900 text-white font-bold py-2 px-4 rounded-full w-1/2"
              >
                {isDeleting ? 'Deleting...' : 'Delete Recipe'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RecipeCard;
