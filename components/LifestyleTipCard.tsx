import React, { useState } from "react";

interface LifestyleTipCardProps {
  tipId: number;
  timestamp: string;
  summary: string;
  tip: string;
  onDelete: (tipId: number) => void;
  uid: string;
}

const LifestyleTipCard: React.FC<LifestyleTipCardProps> = ({
  tipId,
  timestamp,
  summary,
  tip,
  onDelete,
  uid,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const formattedDate = new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const handleCardClick = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this tip?")) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/lifestyletips?uid=${uid}&tipId=${tipId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onDelete(tipId); // Update parent component state
      } else {
        const error = await response.json();
        alert(`Failed to delete tip: ${error.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error deleting tip:", error);
      alert("An error occurred while deleting the tip.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className={`bg-mint rounded-3xl shadow-md border border-forest_green p-6 mb-4 relative cursor-pointer transition-all duration-300 ${
        isExpanded ? "h-auto" : "overflow-hidden h-24"
      }`}
      onClick={handleCardClick}
    >
      {/* Summary for the collapsed view */}
      <h2 className="text-xl font-semibold text-forest_green font-playfair text-center">
        {summary.replace(/\.$/, "")}
      </h2>

      {/* Expanded content */}
      {isExpanded && (
        <>
          <p className="text-base text-forest_green mt-4 text-center font-playfair">
            {tip}
          </p>
          <div className="flex justify-between items-center mt-6">
            <p className="text-sm text-gray-600 italic">{formattedDate}</p>
          </div>

          {/* Delete Button */}
          <div className="flex justify-center mt-4">
            <button
              className="bg-pink-900 hover:bg-pink-800 text-white font-bold py-2 px-4 rounded-full w-1/2"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Tip"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default LifestyleTipCard;
