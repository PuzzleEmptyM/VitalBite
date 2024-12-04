"use client";

import ConditionSelector from "@/components/ConditionSelector";
import FooterNavigation from "@/components/FooterNavigation";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function EditDietPage() {
  const [selectedDiets, setSelectedDiets] = useState<number[]>([]);
  const { data: session, status } = useSession();
  const router = useRouter();

  // Load existing user diets when the page loads
  useEffect(() => {
    const fetchUserDiets = async () => {
      try {
        if (!session?.user?.id) {
          console.error("User ID not available");
          return;
        }

        // Make a GET request to fetch user preferences
        const response = await fetch(`/api/preferences?uid=${session.user.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          const dietIds = data.map((diet: { dietId: number }) => diet.dietId);
          setSelectedDiets(dietIds);
        } else {
          console.error("Failed to load diets:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching diets:", error);
      }
    };

    if (session?.user?.id) {
      fetchUserDiets();
    }
  }, [session]);

  // Handles updating the user's diets
  const handleUpdateDiets = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!session?.user?.id) {
        console.error("User ID not available");
        return;
      }

      // Make a POST request to update user preferences
      const response = await fetch(`/api/preferences?uid=${session.user.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          diets: selectedDiets,
        }),
      });

      if (response.ok) {
        alert("Diets updated successfully!");
      } else {
        console.error("Failed to update diets:", response.statusText);
        alert("Failed to update diets. Please try again.");
      }
    } catch (error) {
      console.error("Error updating diets:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen px-4 bg-white p-4 font-sans">
      {/* Header Section */}
      <Header />

      <div className="flex-grow flex flex-col items-center mt-10 mb-16">
        <div className="flex flex-col items-center">
          {/* Icon */}
          <img
            src="/images/salad.png"
            alt="VitalBite Logo"
            className="w-48 h-48"
            style={{
              marginBottom: "-50px",
              marginTop: "-50px",
            }}
          />
        </div>

        <div>
          <h1 className="text-2xl font-light text-forest_green font-playfair relative text-center pt-9">
            Change Diet
            <span className="absolute mt-4 left-1/2 -translate-x-1/2 bottom-[-8px] w-80 h-[2px] rounded bg-forest_green"></span>
          </h1>
        </div>

        {/* Condition Selector */}
        <div className="flex items-center justify-center mt-6">
          <h2 className="relative w-52 h-16 text-center text-forest_green bg-mint font-playfair py-2 px-2 rounded-full border-teal shadow-md mb-2">
            Please select/de-select <br /> your Diet(s)
          </h2>
        </div>
        <form onSubmit={handleUpdateDiets}>
          <ConditionSelector
            onSelectConditions={setSelectedDiets}
            initialSelectedConditions={selectedDiets}
            isEditMode={true}
          />

          {/* Update Diet Button */}
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="py-2 px-6 bg-teal text-white rounded-full font-playfair shadow-md hover:bg-dark_teal"
            >
              Update Diets
            </button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <FooterNavigation />
    </div>
  );
}
