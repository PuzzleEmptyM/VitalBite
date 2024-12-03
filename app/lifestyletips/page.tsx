"use client";

import { useSession } from "next-auth/react";
import FooterNavigation from "@/components/FooterNavigation";
import Header from "@/components/Header";
import { useEffect, useState } from "react";

const LifestyleTipsPage: React.FC = () => {
  const { data: session } = useSession(); // Get session data
  const [tips, setTips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // Adding loading state for better UX

  useEffect(() => {
    const fetchTips = async () => {
      if (session?.user?.id) {
        try {
          setLoading(true); // Start loading when fetching
          const response = await fetch(`/api/lifestyletips?uid=${session.user.id}`);
          const data = await response.json();

          // Ensure data is an array before setting tips
          if (Array.isArray(data)) {
            setTips(data);
          } else {
            setTips([]); // Handle unexpected data format
          }
        } catch (error) {
          console.error("Error fetching lifestyle tips:", error);
          setTips([]); // Set empty array in case of an error
        } finally {
          setLoading(false); // Stop loading
        }
      }
    };

    if (session?.user?.id) fetchTips();
  }, [session?.user?.id]); // Only refetch when the session id changes

  // Sort tips by timestamp in descending order
  const sortedTips = tips
    ? [...tips].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    : [];

  return (
    <div className="flex flex-col min-h-screen px-4 bg-white p-4 font-sans">
      <Header />

      <main className="flex-grow flex flex-col items-center mb-12">
        <img
          src="/images/branch.png"
          alt="Branch image"
          className="w-60 h-60"
          style={{
            marginTop: "-45px",
            marginBottom: "-15px",
            alignItems: "center",
          }}
        />
        <h1 className="text-xl font-bold text-center text-forest_green mb-6 font-playfair">Lifestyle Tips</h1>

        {loading ? (
          <p>Loading...</p> // Display loading state
        ) : sortedTips.length === 0 ? (
          <p>No lifestyle tips available yet. Check back soon!</p>
        ) : (
          sortedTips.map((tip, index) => (
            <div
              key={index}
              className="bg-mint rounded-3xl shadow-md border border-forest_green p-4 w-full max-w-lg mb-4"
            >
              {/* Summary at the top in bold */}
              {tip.summary && (
                <p className="font-semibold text-lg text-forest_green mb-4 text-center">
                  {tip.summary}
                </p>
              )}

              {/* Tip content in the middle */}
              <p className="text-base text-center font-playfair text-forest_green mb-4">
                {tip.tip}
              </p>

              {/* Tip number at the bottom in smaller italic font */}
              <p className="text-sm text-gray-600 text-right italic">
                Tip #{index + 1}
              </p>
            </div>
          ))
        )}
      </main>
      <FooterNavigation />
    </div>
  );
};

export default LifestyleTipsPage;
