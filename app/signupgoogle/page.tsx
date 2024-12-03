"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ConditionSelector from "../../components/ConditionSelector";
import DisclaimerFooter from "@/components/DisclaimerFooter";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

export default function GoogleSignUpPage() {
  const [selectedDiets, setSelectedDiets] = useState<number[]>([]);
  const router = useRouter();

  const { data: session } = useSession();

  const handleSubmit = async () => {
    try {
      if (!session?.user?.id) {
        console.error("User ID not found in session");
        return;
      }
  
      // Save user preferences
      const response = await fetch("/api/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: session.user.id,
          diets: selectedDiets,
        }),
      });
  
      if (response.ok) {
        // Trigger session update to clear the isNewUser flag
        await fetch("/api/auth/session?update", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        // Logout the user, then redirect to home (forces session to be reset and reloaded)
        await signOut({ redirect: false });
        router.push("/login");
      } else {
        alert("Failed to save preferences. Please try again.");
      }
    } catch (error) {
      console.error("Error saving diet preferences:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      {/* Header Section */}
      <header className="absolute top-0 left-0 p-4">
        <img src="images/vb_logo.png" alt="VB Logo" className="w-20 h-20" />
      </header>

      <div className="w-11/12 max-w-md p-8 bg-white">
        <div className="flex flex-col items-center">
          {/* Welcome Text */}
          <h1 className="mt-4 text-4xl font-bold text-teal font-playfair text-justify pb-4">
            Welcome to <br /> <span className="text-justify pt-2 pl-6"> VitalBite </span>
          </h1>

          {/* Icon */}
          <img
            src="/images/salad.png"
            alt="VitalBite Logo"
            className="w-48 h-48 mt-2"
          />
        </div>

        {/* Condition Selector */}
        <div className="flex items-center justify-center">
          <h2 className="relative w-52 h-16 text-center text-white bg-teal font-playfair py-2 px-4 rounded-full shadow-md">
            Select the diet(s) you would like to follow
          </h2>
        </div>
        <ConditionSelector onSelectConditions={setSelectedDiets} />

        {/* Get Started Button */}
        <button
          onClick={handleSubmit}
          className="w-full max-w-sm p-3 mt-6 bg-teal text-white rounded-lg font-semibold font-playfair"
        >
          Get Started
        </button>

        {/* Create Account Link */}
        <Link
          href="/login"
          className="text-teal font-semibold font-playfair flex justify-center text-sm mt-5"
        >
          Already have an account? Log in here
        </Link>

        {/* Footer */}
        <DisclaimerFooter />
      </div>
    </div>
  );
}
