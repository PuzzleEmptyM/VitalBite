"use client";

import ConditionSelector from "@/components/ConditionSelector";
import Link from "next/link";
import FooterNavigation from "@/components/FooterNavigation";
import axios from "axios";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function EditDietPage() {
    const [selectedDiets, setSelectedDiets] = useState<number[]>([]);
    const [preSelectedDiets, setPreSelectedDiets] = useState<number[]>([]);
    const { data: session, status } = useSession();
    const router = useRouter();

    // Redirect if not authenticated
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    // Load existing user diets on component mount
    useEffect(() => {
        const fetchUserDiets = async () => {
            try {
                if (!session || !session.user || !session.user.id) {
                    console.error("UID not provided");
                    return;
                }
                const response = await axios.get(`/api/preferences?uid=${session.user.id}`);
                if (response.status === 200) {
                    const dietIds = response.data.map((diet: { dietId: number }) => diet.dietId);
                    setSelectedDiets(dietIds);
                    setPreSelectedDiets(dietIds);
                }
            } catch (error) {
                console.error("Failed to fetch user diets:", error);
            }
        };

        if (session && session.user && session.user.id) {
            fetchUserDiets();
        }
    }, [session]);

    // Handles updating the user's diets
    const handleUpdateDiets = async () => {
      try {
          if (!session || !session.user || !session.user.id) {
              console.error("UID not provided");
              return;
          }
          const response = await axios.post(`/api/preferences?uid=${session.user.id}`, {
              diets: selectedDiets,
          });
          
          // Check for a 201 Created response
          if (response.status === 201) {
              alert("Diets updated successfully!");
          } else {
              alert("Failed to update diets. Please try again.");
          }
      } catch (error) {
          console.error("Update diets error:", error);
          alert("An unexpected error occurred. Please try again.");
      }
  };

    const handleDeleteDiet = async (dietId: number) => {
      try {
          if (!session || !session.user || !session.user.id) {
              console.error("UID not provided");
              return;
          }
          const response = await axios.delete(`/api/preferences?uid=${session.user.id}&dietId=${dietId}`);
          if (response.status === 200) {
              setSelectedDiets((prevDiets) => prevDiets.filter((id) => id !== dietId));
          } else {
              alert("Failed to delete diet preference. Please try again.");
          }
      } catch (error) {
          console.error("Delete diet error:", error);
          alert("An unexpected error occurred. Please try again.");
      }
  };

    return (
        <div className="flex flex-col min-h-screen px-4 bg-white p-4 font-sans">
          {/* Header Section */}
          <div>
          <Header />
          </div>
          <div className="flex-grow flex flex-col items-center mb-16">
            <div className="flex flex-col items-center">
              {/* Icon */}
              <img
                src="/images/salad.png"
                alt="VitalBite Logo"
                className="w-48 h-48"
                style={{ marginBottom: '-50px',
                        marginTop: '-50px'
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
                <h2 className="relative w-52 h-16 text-center text-forest_green bg-mint font-playfair py-2 px-2 rounded-full  border-teal shadow-md mb-2">
                  Please select/de-select <br /> your Diet(s)
                </h2>
            </div>
            <ConditionSelector 
                onSelectConditions={setSelectedDiets} 
                initialSelectedConditions={preSelectedDiets} 
                isEditMode={true} // New prop to enable edit mode behavior
                onDeleteCondition={handleDeleteDiet}
            />
            {/* Footer */}
            <FooterNavigation />
          </div>
        </div>
    );
}
