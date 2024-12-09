// pages/LifestyleTipsPage.tsx

"use client";

import { useSession } from "next-auth/react";
import FooterNavigation from "@/components/FooterNavigation";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import LifestyleTipCard from "@/components/LifestyleTipCard";
import SearchBar from "@/components/SearchBar"; // Import the SearchBar component

const LifestyleTipsPage: React.FC = () => {
  const { data: session } = useSession();
  const [tips, setTips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchTips = async () => {
      if (session?.user?.id) {
        try {
          setLoading(true);
          const response = await fetch(`/api/lifestyletips?uid=${session.user.id}`);
          const data = await response.json();

          if (Array.isArray(data)) {
            setTips(data);
          } else {
            setTips([]);
          }
        } catch (error) {
          console.error("Error fetching lifestyle tips:", error);
          setTips([]);
        } finally {
          setLoading(false);
        }
      }
    };

    if (session?.user?.id) fetchTips();
  }, [session?.user?.id]);

  const handleDeleteTip = (tipId: number) => {
    setTips((prevTips) => prevTips.filter((tip) => tip.tipId !== tipId));
  };

  // Function to handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase());
  };

  // Function to filter tips based on search query
  const filterTips = (tips: any[]) => {
    if (!searchQuery) return tips;
    return tips.filter(
      (tip) =>
        tip.summary.toLowerCase().includes(searchQuery) ||
        tip.tip.toLowerCase().includes(searchQuery)
    );
  };

  const sortedTips = tips
    ? [...tips].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
    : [];

  const filteredTips = filterTips(sortedTips);

  return (
    <div className="flex flex-col min-h-screen px-4 bg-white p-4 font-sans">
      {/* Header Section */}
      <Header />

      {/* Branch Icon at the Top */}
      <section>
        <div className="w-60 h-60 flex items-center justify-center mx-auto">
          <img src="/images/branch.png" alt="Branch image" className="w-50 h-50" />
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center mt-0 mb-12">
        {/* Page Title */}
        <h1 className="text-xl font-bold text-center text-forest_green mb-6 font-playfair">
          Lifestyle Tips
        </h1>

        {/* Search Bar */}
        <SearchBar
          placeholder="Search Lifestyle Tips..."
          onSearch={handleSearch}
        />

        {/* Tips Content */}
        {loading ? (
          <p>Loading...</p>
        ) : filteredTips.length === 0 ? (
          <p>No lifestyle tips available yet. Check back soon!</p>
        ) : (
          filteredTips.map((tip) => (
            <LifestyleTipCard
              key={tip.tipId}
              tipId={tip.tipId}
              timestamp={tip.timestamp}
              summary={tip.summary}
              tip={tip.tip}
              onDelete={handleDeleteTip}
              uid={session?.user?.id || ""}
            />
          ))
        )}
      </main>

      {/* Footer */}
      <FooterNavigation />
    </div>
  );
};

export default LifestyleTipsPage;
