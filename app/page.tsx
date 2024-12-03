"use client";

import React from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import FooterNavigation from "@/components/FooterNavigation";
import Header from "@/components/Header";

const Page = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

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
      <Header />

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
              onClick={() => router.push("/condition")}
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
          onClick={() => router.push("/doanddont")}
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
          onClick={() => router.push("/healthytips")}
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
          onClick={() => router.push("/ingredientanalyzer")}
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
      <section className="mt-6 p-4 rounded-lg font-playfair flex items-center">
        <div className="w-1/3 pr-6 pl-0">
          <img
            src="/images/tomato.png"
            alt="AI Chatbot"
            className="w-auto h-auto max-w-none mb-2 ml-[-50]"
            style={{ width: '200px' }}
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
            onClick={() => router.push("/aichatbot")}
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
