"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "../../components/InputField";
import GetStartedButton from "../../components/GetStartedButton";
import ConditionSelector from "../../components/ConditionSelector";
import Link from "next/link";
import DisclaimerFooter from "@/components/DisclaimerFooter";
import LogoHeader from "@/components/LogoHeader";

export default function GoogleSignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const router = useRouter();

//   const handleSignUp = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post("../api/users", {
//         email,
//         password,
//         username: fullName,
//       });

//       if (response.status === 201) {
//         // Successfully signed up, redirect to login or home page
//         router.push("/login");
//       } else {
//         alert("Failed to create account. Please try again.");
//       }
//     } catch (error) {
//       console.error("Sign-up error:", error);
//       alert("An unexpected error occurred. Please try again.");
//     }
//   };

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
          <ConditionSelector />

          {/* Get Started Button */}
          <GetStartedButton text="Get Started" />

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
