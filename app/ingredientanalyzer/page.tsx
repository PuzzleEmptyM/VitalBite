"use client";

import { useState } from "react";
import DisclaimerFooter from "@/components/DisclaimerFooter";
import FooterNavigation from "@/components/FooterNavigation";
import Header from "@/components/Header";
import Head from "next/head";
import { useSession } from "next-auth/react";

export default function IngredientsAnalyzerPage() {
  const [food, setFood] = useState("");
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("neutral"); // 'neutral', 'safe', 'unsafe', 'caution', 'not_found'
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  const handleSearch = async () => {
    if (!food) return;

    setLoading(true);
    setResult(null); // Clear previous result
    setStatus("neutral"); // Reset status
    try {
      const response = await fetch("/api/foodchecker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: food,
          uid: session?.user?.id // Replace with actual UID logic if needed
        }),
      });

      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      const data = await response.json();

      // Update result and status based on the response
      setResult(data);
      setStatus(data.classify.toLowerCase());
    } catch (error) {
      console.error("Error fetching food analysis:", error);
      setResult({ base: "Error fetching result", info: "Please try again later." });
      setStatus("neutral");
    } finally {
      setLoading(false);
    }
  };

  const getBoxClasses = () => {
    const colorClasses = {
      neutral: "bg-white border-gray-400 text-gray-600",
      safe: "bg-green-100 border-green-400 text-green-700",
      unsafe: "bg-red-100 border-red-400 text-red-700",
      caution: "bg-yellow-100 border-yellow-400 text-yellow-700",
      not_found: "bg-gray-100 border-gray-400 text-gray-600",
    };
    return `w-full max-w-md p-6 rounded-2xl border shadow-lg text-center ${colorClasses[status]}`;
  };

  return (
    <div className="flex flex-col min-h-screen px-4 bg-white p-4 font-sans">
      <Head>
        <title>Diet Analyzer</title>
      </Head>

      {/* Header Section */}
      <Header />

      {/* Main Content */}
      <main className="flex flex-col items-center w-full mt-2 space-y-6">
        {/* Title Section */}
        <div className="text-center">
          <h1 className="text-4xl font-light text-forest_green font-playfair relative pt-9">
            Diet Analyzer
            <span className="absolute mt-4 left-1/2 -translate-x-1/2 bottom-[-8px] w-80 h-[2px] rounded bg-forest_green"></span>
          </h1>
          <p className="text-forest_green font-playfair mt-4">
            Discover which foods and ingredients align with your dietary restrictions
          </p>
        </div>

        {/* Search Input */}
        <div className="w-full max-w-md px-8">
          <input
            type="text"
            value={food}
            onChange={(e) => setFood(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            placeholder="Search..."
            className="w-full h-10 p-3 text-lg bg-cream border border-forest_green rounded-full shadow-md pl-9 placeholder-forest_green focus:outline-none focus:ring focus:ring-forest_green text-teal"
          />
          <button
            onClick={handleSearch}
            className="mt-4 w-full h-10 bg-forest_green text-white rounded-full shadow-md"
          >
            Analyze
          </button>
        </div>

        {/* Results Section */}
        <div className="px-8 pt-7">
          <div className={getBoxClasses()}>
            {loading ? (
              <p className="text-lg font-bold">Thinking...</p>
            ) : result ? (
              <>
                <p className="text-xl font-bold">{result.base}</p>
                <p className="mt-4">{result.info}</p>
              </>
            ) : (
              <p className="text-lg font-bold">Enter a food or ingredient to analyze.</p>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <div className="mb-12">
        <FooterNavigation />
      </div>
    </div>
  );
}
