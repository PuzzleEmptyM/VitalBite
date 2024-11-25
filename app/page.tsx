"use client";

import React from "react";
import { useSession, signIn } from "next-auth/react";
import FooterNavigation from "@/components/FooterNavigation";

const Page = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  // If unauthenticated, redirect to sign in
  if (status === "unauthenticated") {
    signIn(); // Redirects to sign-in page
    return null; // Render nothing until redirection
  }

  // Extract username from session data
  const username = session?.user?.name || "Guest";

  return (
    <div className="bg-white min-h-screen p-4 font-sans">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <div onClick={() => alert("Home!")} className="cursor-pointer">
          <img src="/images/vb_logo.png" alt="Logo" className="w-20 h-20" />
        </div>

        {/* Profile Section */}
        <div className="flex items-center space-x-4">
          <div
            className="w-10 h-10 bg-mint text-forest_green font-bold font-playfair rounded-full flex items-center justify-center border-2 border-forest_green shadow-md"
            onClick={() => alert("User profile!")}
          >
            {username[0].toUpperCase()} {/* First letter of username */}
          </div>
          <button
            className="bg-mint text-forest_green px-4 py-2 font-bold font-playfair rounded-full shadow-md border-2 border-forest_green"
            onClick={() => alert("Logout!")}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Welcome Section */}
      <section className="text-center mb-6">
        <img
          src="/images/vitalbite.png"
          alt="VitalBite Logo"
          className="mx-auto mb-2"
        />
        <h2 className="text-4xl font-bold font-hellowin text-teal">
          Welcome, {username}!
        </h2>
        <div className="mt-4 text-left font-playfair flex items-center justify-between">
          <div className="w-full text-left ml-4">
            <h3 className="text-xl font-bold text-forest_green">
              Understand Your Condition
            </h3>
            <p className="text-sm text-forest_green mt-2 font-semibold">
              Get clear, reliable information about your medical condition(s) to
              make informed decisions about your health and lifestyle
            </p>
            <button
              className="mt-4 bg-teal text-white px-4 py-2 rounded-full border-2 border-forest_green w-40 shadow-md"
              onClick={() => alert("Understand Condition!")}
            >
              Learn More
            </button>
          </div>

          {/* Image Section */}
          <div className="w-80 h-80 flex items-start justify-start mb-2 mt-12">
            <img
              src="/images/health.png"
              alt="Health Icon"
              className="w-70 h-70"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-2 gap-4">
        {/* First Card */}
        <div
          className="bg-mint rounded-lg p-4 flex flex-col items-center border-2 border-forest_green mt-8 shadow-lg"
          onClick={() => alert("do and dont!")}
        >
          <img
            src="/images/avocado.png"
            alt="Do's and Don'ts"
            className="w-25 h-25 mb-2"
          />
          <h4 className="text-forest_green font-playfair font-semibold border-b-2 border-forest_green mb-2">
            Do's and Don'ts
          </h4>
        </div>

        {/* Second Card */}
        <div
          className="bg-mint rounded-lg p-4 flex flex-col items-center border-2 border-forest_green mt-8 shadow-lg"
          onClick={() => alert("Healthy tips!")}
        >
          <img
            src="/images/heart.png"
            alt="Healthy Tips"
            className="w-25 h-25 mb-2"
          />
          <h4 className="text-forest_green font-playfair font-semibold border-b-2 border-forest_green mb-2">
            Healthy Tips
          </h4>
        </div>

        {/* Third Card */}
        <div
          className="bg-mint rounded-lg p-4 flex flex-col items-center col-span-2 border-2 border-forest_green mt-8 shadow-lg"
          onClick={() => alert("Ingredient Analyzer!")}
        >
          <img
            src="/images/spoon.png"
            alt="Ingredient Analyzer"
            className="w-25 h-25 mb-2"
          />
          <h4 className="text-forest_green font-playfair font-semibold border-b-2 border-forest_green mb-2">
            Ingredient Analyzer
          </h4>
        </div>
      </section>

      {/* AI Chatbot Section */}
      <section className="mt-6 bg-white p-4 rounded-lg font-playfair flex items-center">
        <div className="w-1/3 pr-6 pl-0">
          <img
            src="/images/tomato.png"
            alt="AI Chatbot"
            className="w-auto h-auto max-w-none mb-2 ml-[-50]"
          />
        </div>

        <div className="w-full text-left ml-8">
          <h3 className="text-lg font-bold text-forest_green">AI Chatbot</h3>
          <p className="text-sm text-forest_green mt-2 font-semibold">
            Chat with our AI assistant to get personalized recipes, meal
            suggestions, and lifestyle tips tailored to your health needs. Your
            questions, answered instantly and effortlessly!
          </p>
          <button
            className="mt-4 bg-teal text-white px-4 py-2 rounded-full border-2 border-forest_green w-40 shadow-md"
            onClick={() => alert("Chatbot!")}
          >
            Try Now
          </button>
        </div>
      </section>

      <div className="mb-12">
        <FooterNavigation />
      </div>
    </div>
  );
};

export default Page;
