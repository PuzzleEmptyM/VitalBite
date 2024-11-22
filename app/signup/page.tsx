"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "../../components/InputField";
import GetStartedButton from "../../components/GetStartedButton";
import ConditionSelector from "../../components/ConditionSelector";
import Link from "next/link";
import axios from "axios";
import DisclaimerFooter from "@/components/DisclaimerFooter";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("../api/users", {
        email,
        password,
        username: fullName,
      });

      if (response.status === 201) {
        // Successfully signed up, redirect to login or home page
        router.push("/login");
      } else {
        alert("Failed to create account. Please try again.");
      }
    } catch (error) {
      console.error("Sign-up error:", error);
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
          <h1 className="mt-4 text-4xl font-bold text-teal font-playfair text-justify pb-4 pt-12">
            Welcome to <br /> <span className="text-justify pt-2 pl-6"> VitalBite </span>
          </h1>

          {/* Icon */}
          <img
            src="/images/salad.png"
            alt="VitalBite Logo"
            className="w-48 h-48 mt-2"
          />
        </div>

        {/* Form */}
        <form className="mt-6" onSubmit={handleSignUp}>
          <InputField
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <InputField
            type="email"
            placeholder="Email"
            className="mt-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputField
            type="password"
            placeholder="Password"
            className="mt-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Condition Selector */}
          <div className="flex items-center justify-center">
            <h2 className="relative w-52 h-16 text-center text-white bg-teal font-playfair py-2 px-4 rounded-full shadow-md">
              Please select your <br /> medical condition(s)
            </h2>
          </div>
          <ConditionSelector />

          {/* Get Started Button */}
          <GetStartedButton text="Get Started" />
        </form>

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
