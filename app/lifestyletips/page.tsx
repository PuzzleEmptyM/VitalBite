"use client";

import { useSession } from "next-auth/react";
import FooterNavigation from "@/components/FooterNavigation";
import Header from "@/components/Header";
import { useEffect, useState } from "react";

const LifestyleTipsPage: React.FC = () => {
  const { data: session } = useSession(); // Get session data
  const [tips, setTips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // Adding loading state for better UX
  const [expandedTipId, setExpandedTipId] = useState<number | null>(null); // Track expanded tip

  useEffect(() => {
    const fetchTips = async () => {
      if (session?.user?.id) {
        try {
          setLoading(true); // Start loading when fetching
          const response = await fetch(
            `/api/lifestyletips?uid=${session.user.id}`
          );
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
    ? [...tips].sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
    : [];

  // Handle card click
  const handleCardClick = (tipId: number) => {
    setExpandedTipId(tipId === expandedTipId ? null : tipId); // Toggle expansion
  };

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
        <h1 className="text-xl font-bold text-center text-forest_green mb-6 font-playfair">
          Lifestyle Tips
        </h1>

        {loading ? (
          <p>Loading...</p> // Display loading state
        ) : sortedTips.length === 0 ? (
          <p>No lifestyle tips available yet. Check back soon!</p>
        ) : (
          sortedTips.map((tip, index) => (
            <div
              key={index}
              className={`bg-mint rounded-3xl shadow-md border border-forest_green p-4 w-full max-w-lg mb-4 transition-all duration-300 ${
                expandedTipId === tip.tipId ? "h-auto" : "overflow-hidden h-24"
              }`}
            >
              {/* Summary at the top in bold */}
              <p
                className="font-semibold text-lg text-forest_green mb-4 text-center cursor-pointer"
                onClick={() => handleCardClick(tip.tipId)}
              >
                {tip.summary.replace(/\.$/, "")}
              </p>

              {/* Expanded content (only visible if expanded) */}
              {expandedTipId === tip.tipId && (
                <div>
                  <p className="text-base text-center font-playfair text-forest_green mb-4">
                    {tip.tip}
                  </p>
                  <div className="flex justify-center mt-4">
                    <button
                      className="bg-mint text-forest_green px-4 py-2 font-bold font-playfair rounded-full shadow-md border-2 border-forest_green"
                      onClick={() => setExpandedTipId(null)}
                    >
                      Minimize
                    </button>
                  </div>
                </div>
              )}

              {/* Tip number and date at the bottom */}
              <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-gray-600 italic">Tip #{index + 1}</p>
                <p className="text-sm text-gray-600 italic">
                  {new Date(tip.timestamp).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        )}
      </main>
      <FooterNavigation />
    </div>
  );
};

export default LifestyleTipsPage;
